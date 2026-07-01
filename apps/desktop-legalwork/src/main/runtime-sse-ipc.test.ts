import { EventEmitter } from 'node:events'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  defaultClawSettings,
  defaultKeyboardShortcuts,
  defaultLegalworkRuntimeSettings,
  defaultModelProviderSettings,
  defaultScheduleSettings,
  defaultWriteSettings,
  type AppSettingsV1
} from '../shared/app-settings'
import {
  registerRuntimeSseIpc,
  stopAllRuntimeSse,
  stopRuntimeSseForWebContents
} from './runtime-sse-ipc'

type Handler = (event: { sender: WebContentsMock }, payload?: unknown) => Promise<unknown>

class WebContentsMock extends EventEmitter {
  readonly id: number
  readonly send = vi.fn()
  private destroyed = false

  constructor(id: number) {
    super()
    this.id = id
  }

  isDestroyed(): boolean {
    return this.destroyed
  }

  destroy(): void {
    this.destroyed = true
    this.emit('destroyed')
  }
}

const handlers = new Map<string, Handler>()

function settings(): AppSettingsV1 {
  return {
    version: 1,
    locale: 'en',
    theme: 'system',
    uiFontScale: 'small',
    provider: defaultModelProviderSettings(),
    agents: {
      legalwork: defaultLegalworkRuntimeSettings()
    },
    workspaceRoot: '/tmp/workspace',
    log: { enabled: false, retentionDays: 7 },
    notifications: { turnComplete: true },
    appBehavior: { openAtLogin: false, startMinimized: false, closeToTray: false },
    keyboardShortcuts: defaultKeyboardShortcuts(),
    write: defaultWriteSettings(),
    claw: defaultClawSettings(),
    schedule: defaultScheduleSettings(),
    guiUpdate: { channel: 'stable' }
  }
}

function register(): void {
  registerRuntimeSseIpc({
    ipcMain: {
      handle: (channel: string, handler: Handler) => {
        handlers.set(channel, handler)
      }
    } as never,
    store: { load: vi.fn(async () => settings()) } as never,
    ensureRuntime: vi.fn(async () => undefined),
    logError: vi.fn()
  })
}

async function waitFor(predicate: () => boolean): Promise<void> {
  for (let i = 0; i < 20; i += 1) {
    if (predicate()) return
    await new Promise((resolve) => setTimeout(resolve, 0))
  }
  expect(predicate()).toBe(true)
}

describe('runtime SSE IPC lifecycle', () => {
  beforeEach(() => {
    handlers.clear()
    vi.restoreAllMocks()
    vi.stubGlobal('fetch', vi.fn((_url: string, init?: RequestInit) => {
      const signal = init?.signal
      return new Promise<Response>((_resolve, reject) => {
        signal?.addEventListener('abort', () => reject(new Error('aborted')), { once: true })
      })
    }))
  })

  afterEach(() => {
    stopAllRuntimeSse()
    vi.unstubAllGlobals()
  })

  it('notifies the renderer when the host stops all SSE streams', async () => {
    register()
    const sender = new WebContentsMock(1)
    await handlers.get('runtime:sse:start')?.({
      sender
    }, {
      threadId: 'thr_1',
      sinceSeq: 0,
      streamId: 'stream_1'
    })

    stopAllRuntimeSse()

    await waitFor(() => sender.send.mock.calls.some(([channel]) => channel === 'runtime:sse-end'))
    expect(sender.send).toHaveBeenCalledWith('runtime:sse-end', { streamId: 'stream_1' })
  })

  it('stops only streams owned by the requested web contents', async () => {
    register()
    const first = new WebContentsMock(1)
    const second = new WebContentsMock(2)
    await handlers.get('runtime:sse:start')?.({ sender: first }, {
      threadId: 'thr_1',
      sinceSeq: 0,
      streamId: 'stream_1'
    })
    await handlers.get('runtime:sse:start')?.({ sender: second }, {
      threadId: 'thr_2',
      sinceSeq: 0,
      streamId: 'stream_2'
    })

    stopRuntimeSseForWebContents(first.id)

    await waitFor(() => first.send.mock.calls.some(([channel]) => channel === 'runtime:sse-end'))
    expect(first.send).toHaveBeenCalledWith('runtime:sse-end', { streamId: 'stream_1' })
    expect(second.send).not.toHaveBeenCalledWith('runtime:sse-end', { streamId: 'stream_2' })
    stopAllRuntimeSse()
  })
})
