import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { FileAttachmentStore } from '../src/attachments/attachment-store.js'
import { DeepseekCompatModelClient } from '../src/adapters/model/deepseek-compat-model-client.js'
import {
  LegalworkCapabilitiesConfig,
  type AttachmentsCapabilityConfig,
  type ModelCapabilityMetadata
} from '../src/contracts/capabilities.js'
import { modelCapabilitiesForModel } from '../src/loop/model-context-profile.js'
import type { ModelClient, ModelRequest } from '../src/ports/model-client.js'
import { dispatchRequest } from '../src/server/http-server.js'
import { bootstrapThread, makeHarness } from './loop-test-harness.js'
import { buildHarness, readJson } from './http-server-test-harness.js'

describe('Attachment store and multimodal input', () => {
  let dir = ''

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'legalwork-attachments-'))
  })

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true })
  })

  it('stores images outside session logs, deduplicates by hash, and enforces scope', async () => {
    const store = createStore()
    const data = png(2, 3)
    const first = await store.create({
      name: 'shot.png',
      data,
      mimeType: 'image/png',
      threadId: 'thr_1',
      workspace: '/tmp/ws'
    })
    const second = await store.create({
      name: 'shot-again.png',
      data,
      threadId: 'thr_1'
    })

    expect(second.id).toBe(first.id)
    expect(first).toMatchObject({ mimeType: 'image/png', width: 2, height: 3, byteSize: data.byteLength })
    await expect(store.resolveContent(first.id, { threadId: 'thr_2' })).rejects.toThrow(/not authorized/)
    await expect(store.resolveContent(first.id, { workspace: '/tmp/ws' })).resolves.toMatchObject({ id: first.id })
  })

  it('repairs missing content when a duplicate attachment is uploaded again', async () => {
    const store = createStore()
    const data = png(2, 3)
    const first = await store.create({
      name: 'shot.png',
      data,
      threadId: 'thr_1'
    })
    await rm(join(dir, 'attachments', `${first.id}.bin`), { force: true })

    const second = await store.create({
      name: 'shot-again.png',
      data,
      threadId: 'thr_1'
    })

    expect(second.id).toBe(first.id)
    await expect(store.resolveContent(first.id, { threadId: 'thr_1' })).resolves.toMatchObject({
      id: first.id,
      data
    })
  })

  it('stores non-image files and still rejects disallowed MIME, size, and image dimensions', async () => {
    await expect(createStore().create({
      name: 'notes.txt',
      data: Buffer.from('hello'),
      mimeType: 'text/plain'
    })).resolves.toMatchObject({
      name: 'notes.txt',
      mimeType: 'text/plain',
      byteSize: 5
    })

    await expect(createStore({ allowedMimeTypes: ['image/png'] }).create({
      name: 'bad.txt',
      data: Buffer.from('nope'),
      mimeType: 'text/plain'
    })).rejects.toThrow(/not allowed/)

    await expect(createStore({ maxImageBytes: 10 }).create({
      name: 'large.png',
      data: png(1, 1)
    })).rejects.toThrow(/byte limit/)

    await expect(createStore({ maxImageDimension: 4 }).create({
      name: 'huge.png',
      data: png(5, 1)
    })).rejects.toThrow(/dimension/)

    await expect(createStore({ textFallbackMaxBase64Bytes: 4 }).create({
      name: 'fallback-large.png',
      data: png(1, 1),
      textFallback: {
        dataBase64: 'abcdefgh',
        mimeType: 'image/png',
        byteSize: 6,
        width: 1,
        height: 1
      }
    })).rejects.toThrow(/fallback image exceeds/)
  })

  it('serves authenticated upload, metadata, content, and diagnostics routes', async () => {
    const h = buildHarness()
    h.runtime.attachmentStore = createStore()
    const upload = await dispatchRequest(
      h.router,
      new Request('http://localhost/v1/attachments', {
        method: 'POST',
        headers: { authorization: 'Bearer tok-1', 'content-type': 'application/json' },
        body: JSON.stringify({
          name: 'shot.png',
          mimeType: 'image/png',
          dataBase64: png(1, 1).toString('base64'),
          threadId: 'thr_1',
          textFallback: {
            dataBase64: 'abcd',
            mimeType: 'image/png',
            byteSize: 3,
            width: 1,
            height: 1,
            wasCompressed: false
          }
        })
      })
    )

    expect(upload.status).toBe(201)
    const uploaded = await readJson(upload) as { attachment: { id: string } }
    const metadata = await dispatchRequest(
      h.router,
      new Request(`http://localhost/v1/attachments/${uploaded.attachment.id}`, {
        headers: { authorization: 'Bearer tok-1' }
      })
    )
    expect(metadata.status).toBe(200)
    expect(await readJson(metadata)).toMatchObject({
      attachment: {
        textFallback: {
          dataBase64: 'abcd',
          mimeType: 'image/png'
        }
      }
    })
    const content = await dispatchRequest(
      h.router,
      new Request(`http://localhost/v1/attachments/${uploaded.attachment.id}/content?thread_id=thr_1`, {
        headers: { authorization: 'Bearer tok-1' }
      })
    )
    expect(content.status).toBe(200)
    expect((await readJson(content)) as { dataBase64?: string }).toMatchObject({
      dataBase64: expect.any(String)
    })
    const diagnostics = await dispatchRequest(
      h.router,
      new Request('http://localhost/v1/attachments/diagnostics', {
        headers: { authorization: 'Bearer tok-1' }
      })
    )
    expect(await readJson(diagnostics)).toMatchObject({ enabled: true, count: 1 })
  })

  it('resolves image attachments for vision models and text fallbacks for text-only models', async () => {
    const store = createStore()
    const attachment = await store.create({
      name: 'shot.png',
      data: png(1, 1),
      threadId: 'thr_1',
      workspace: '/tmp/ws'
    })
    const seenRequests: ModelRequest[] = []
    const model: ModelClient = {
      provider: 'fake',
      model: 'fake',
      async *stream(request) {
        seenRequests.push(request)
        yield { kind: 'completed', stopReason: 'stop' }
      }
    }
    const h = makeHarness(model, {
      attachmentStore: store,
      modelCapabilities: () => visionCapabilities()
    })
    await bootstrapThread(h, {
      workspace: '/tmp/ws',
      request: { prompt: 'look', attachmentIds: [attachment.id], model: 'vision-model' }
    })

    await h.loop.runTurn(h.threadId, h.turnId)

    expect(seenRequests.at(-1)?.attachments?.[0]).toMatchObject({
      id: attachment.id,
      mimeType: 'image/png',
      dataBase64: expect.any(String)
    })

    const textOnly = makeHarness(model, {
      attachmentStore: store,
      modelCapabilities: () => ({ ...visionCapabilities(), inputModalities: ['text'] })
    })
    await bootstrapThread(textOnly, {
      workspace: '/tmp/ws',
      request: { prompt: 'look', attachmentIds: [attachment.id], model: 'text-only' }
    })
    expect(await textOnly.loop.runTurn(textOnly.threadId, textOnly.turnId)).toBe('completed')
    expect(seenRequests.at(-1)?.attachments).toBeUndefined()
    expect(seenRequests.at(-1)?.attachmentTextFallbacks?.[0]).toMatchObject({
      id: attachment.id,
      mimeType: 'image/png',
      dataBase64: expect.any(String),
      wasCompressed: false
    })
  })

  it('routes non-image files as text fallbacks even for vision models', async () => {
    const store = createStore()
    const attachment = await store.create({
      name: 'notes.txt',
      data: Buffer.from('hello'),
      mimeType: 'text/plain',
      threadId: 'thr_1',
      workspace: '/tmp/ws'
    })
    const seenRequests: ModelRequest[] = []
    const model: ModelClient = {
      provider: 'fake',
      model: 'fake',
      async *stream(request) {
        seenRequests.push(request)
        yield { kind: 'completed', stopReason: 'stop' }
      }
    }
    const h = makeHarness(model, {
      attachmentStore: store,
      modelCapabilities: () => visionCapabilities()
    })
    await bootstrapThread(h, {
      workspace: '/tmp/ws',
      request: { prompt: 'read this', attachmentIds: [attachment.id], model: 'vision-model' }
    })

    expect(await h.loop.runTurn(h.threadId, h.turnId)).toBe('completed')
    expect(seenRequests.at(-1)?.attachments).toBeUndefined()
    expect(seenRequests.at(-1)?.attachmentTextFallbacks?.[0]).toMatchObject({
      id: attachment.id,
      mimeType: 'text/plain',
      dataBase64: Buffer.from('hello').toString('base64')
    })
  })

  it('routes built-in DeepSeek v4 image attachments as text fallbacks', async () => {
    const store = createStore()
    const attachment = await store.create({
      name: 'shot.png',
      data: png(1, 1),
      threadId: 'thr_1',
      workspace: '/tmp/ws'
    })
    const seenRequests: ModelRequest[] = []
    const model: ModelClient = {
      provider: 'fake',
      model: 'fake',
      async *stream(request) {
        seenRequests.push(request)
        yield { kind: 'completed', stopReason: 'stop' }
      }
    }
    const h = makeHarness(model, {
      attachmentStore: store,
      modelCapabilities: modelCapabilitiesForModel
    })
    await bootstrapThread(h, {
      workspace: '/tmp/ws',
      request: { prompt: 'look', attachmentIds: [attachment.id], model: 'deepseek-v4-pro' }
    })

    expect(await h.loop.runTurn(h.threadId, h.turnId)).toBe('completed')
    const userItem = (await h.sessionStore.loadItems(h.threadId))
      .find((item) => item.kind === 'user_message')
    expect(userItem).toMatchObject({ attachmentIds: [attachment.id] })
    await expect(h.turns.getTurn(h.threadId, h.turnId)).resolves.toMatchObject({
      attachmentIds: [attachment.id]
    })
    expect(seenRequests.at(-1)?.attachments).toBeUndefined()
    expect(seenRequests.at(-1)?.attachmentTextFallbacks?.[0]).toMatchObject({
      id: attachment.id,
      mimeType: 'image/png',
      dataBase64: expect.any(String),
      wasCompressed: false
    })
    const preSend = (await h.sessionStore.loadEventsSince(h.threadId, 0))
      .find((event): event is Extract<typeof event, { kind: 'pipeline_stage' }> =>
        event.kind === 'pipeline_stage' && event.stage === 'pre_send'
      )
    expect(preSend?.details).toMatchObject({
      attachmentIds: [attachment.id],
      modelInputModalities: ['text'],
      modelMessageParts: ['text'],
      imageAttachmentCount: 0,
      imageAttachmentBase64Bytes: 0,
      textFallbackCount: 1,
      textFallbackBase64Bytes: png(1, 1).toString('base64').length,
      textFallbackMimeTypes: ['image/png']
    })
  })

  it('keeps oversized text fallbacks as metadata-only attachment context', async () => {
    const store = createStore({ textFallbackMaxBase64Bytes: 8 })
    const attachment = await store.create({
      name: 'shot.png',
      data: png(1, 1),
      threadId: 'thr_1',
      workspace: '/tmp/ws'
    })
    const seenRequests: ModelRequest[] = []
    const model: ModelClient = {
      provider: 'fake',
      model: 'fake',
      async *stream(request) {
        seenRequests.push(request)
        yield { kind: 'completed', stopReason: 'stop' }
      }
    }
    const h = makeHarness(model, {
      attachmentStore: store,
      modelCapabilities: () => ({ ...visionCapabilities(), inputModalities: ['text'] })
    })
    await bootstrapThread(h, {
      workspace: '/tmp/ws',
      request: { prompt: 'look', attachmentIds: [attachment.id], model: 'text-only' }
    })

    expect(await h.loop.runTurn(h.threadId, h.turnId)).toBe('completed')
    expect(seenRequests.at(-1)?.attachmentTextFallbacks?.[0]).toMatchObject({
      id: attachment.id,
      mimeType: 'image/png',
      dataBase64: '',
      byteSize: png(1, 1).byteLength
    })
  })

  it('maps image attachments to DeepSeek-compatible message parts', async () => {
    let body: { messages?: Array<{ role: string; content: unknown }> } | undefined
    const client = new DeepseekCompatModelClient({
      baseUrl: 'https://model.example.test',
      apiKey: '',
      model: 'vision-model',
      nonStreaming: true,
      fetchImpl: async (_url, init) => {
        body = JSON.parse(String(init?.body))
        return new Response(JSON.stringify({
          id: 'cmpl_1',
          model: 'vision-model',
          choices: [{ index: 0, finish_reason: 'stop', message: { role: 'assistant', content: 'ok' } }]
        }), { status: 200, headers: { 'content-type': 'application/json' } })
      }
    })

    for await (const _chunk of client.stream({
      threadId: 'thr_1',
      turnId: 'turn_1',
      model: 'vision-model',
      prefix: [],
      history: [{
        id: 'item_user',
        threadId: 'thr_1',
        turnId: 'turn_1',
        role: 'user',
        status: 'completed',
        createdAt: 'now',
        finishedAt: 'now',
        kind: 'user_message',
        text: 'describe'
      }],
      attachments: [{
        id: 'att_1',
        name: 'shot.png',
        mimeType: 'image/png',
        dataBase64: png(1, 1).toString('base64')
      }],
      tools: [],
      abortSignal: new AbortController().signal
    })) {
      // drain stream
    }

    expect(body?.messages?.[0]?.content).toEqual([
      { type: 'text', text: 'describe' },
      { type: 'image_url', image_url: { url: expect.stringMatching(/^data:image\/png;base64,/) } }
    ])
  })

  it('maps text attachment fallbacks to structured DeepSeek-compatible user text', async () => {
    let body: { messages?: Array<{ role: string; content: unknown }> } | undefined
    const client = new DeepseekCompatModelClient({
      baseUrl: 'https://model.example.test',
      apiKey: '',
      model: 'text-model',
      nonStreaming: true,
      fetchImpl: async (_url, init) => {
        body = JSON.parse(String(init?.body))
        return new Response(JSON.stringify({
          id: 'cmpl_1',
          model: 'text-model',
          choices: [{ index: 0, finish_reason: 'stop', message: { role: 'assistant', content: 'ok' } }]
        }), { status: 200, headers: { 'content-type': 'application/json' } })
      }
    })

    for await (const _chunk of client.stream({
      threadId: 'thr_1',
      turnId: 'turn_1',
      model: 'text-model',
      prefix: [],
      history: [{
        id: 'item_user',
        threadId: 'thr_1',
        turnId: 'turn_1',
        role: 'user',
        status: 'completed',
        createdAt: 'now',
        finishedAt: 'now',
        kind: 'user_message',
        text: 'describe'
      }],
      attachmentTextFallbacks: [{
        id: 'att_1',
        name: 'shot.png',
        mimeType: 'image/webp',
        dataBase64: 'YWJj',
        byteSize: 3,
        width: 1280,
        height: 720,
        wasCompressed: true
      }],
      tools: [],
      abortSignal: new AbortController().signal
    })) {
      // drain stream
    }

    expect(body?.messages?.[0]?.content).toContain('describe')
    expect(body?.messages?.[0]?.content).toContain('[Attached file]')
    expect(body?.messages?.[0]?.content).toContain('MIME: image/webp')
    expect(body?.messages?.[0]?.content).toContain('Dimensions: 1280x720')
    expect(body?.messages?.[0]?.content).toContain('```base64\nYWJj\n```')
  })

  function createStore(overrides: Partial<AttachmentsCapabilityConfig> = {}) {
    return new FileAttachmentStore({
      rootDir: join(dir, 'attachments'),
      config: attachmentConfig(overrides),
      nowIso: () => '2026-06-03T00:00:00.000Z'
    })
  }

  function attachmentConfig(overrides: Partial<AttachmentsCapabilityConfig> = {}) {
    return LegalworkCapabilitiesConfig.parse({
      attachments: {
        enabled: true,
        ...overrides
      }
    }).attachments
  }
})

function png(width: number, height: number): Buffer {
  const buffer = Buffer.alloc(24)
  buffer[0] = 0x89
  buffer[1] = 0x50
  buffer[2] = 0x4e
  buffer[3] = 0x47
  buffer[4] = 0x0d
  buffer[5] = 0x0a
  buffer[6] = 0x1a
  buffer[7] = 0x0a
  buffer.writeUInt32BE(width, 16)
  buffer.writeUInt32BE(height, 20)
  return buffer
}

function visionCapabilities(): ModelCapabilityMetadata {
  return {
    id: 'vision-model',
    inputModalities: ['text', 'image'],
    outputModalities: ['text'],
    supportsToolCalling: true,
    contextWindowTokens: 128_000,
    messageParts: ['text', 'image_url']
  }
}
