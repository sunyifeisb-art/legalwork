import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { describe, expect, it } from 'vitest'
import { FileKnowledgeStore } from './knowledge-store.js'
import { KnowledgeRetrievalPipeline } from './knowledge-retrieval-pipeline.js'
import type { ModelClient, ModelRequest, ModelStreamChunk } from '../ports/model-client.js'

class StaticClassifierModel implements ModelClient {
  readonly provider = 'test'
  readonly model = 'test-classifier'
  requests: ModelRequest[] = []

  constructor(private readonly response: string) {}

  async *stream(request: ModelRequest): AsyncIterable<ModelStreamChunk> {
    this.requests.push(request)
    yield { kind: 'assistant_text_delta', text: this.response }
    yield { kind: 'completed', stopReason: 'stop' }
  }
}

describe('FileKnowledgeStore', () => {
  it('syncs local files and searches Chinese legal terms', async () => {
    const root = await mkdtemp(join(tmpdir(), 'legalwork-kb-'))
    const sourceRoot = join(root, 'knowledge-base')
    const indexRoot = join(root, 'index')
    try {
      await mkdir(sourceRoot, { recursive: true })
      await writeFile(join(sourceRoot, 'personal-info.md'), [
        '# 个人信息保护法',
        '',
        '处理敏感个人信息应当取得个人的单独同意，并采取严格保护措施。'
      ].join('\n'), { encoding: 'utf8' })

      const store = new FileKnowledgeStore({
        rootDir: indexRoot,
        sourceRoots: [sourceRoot],
        nowIso: () => '2026-06-13T00:00:00.000Z'
      })

      const sync = await store.sync()
      expect(sync.documentCount).toBe(1)
      expect(sync.chunkCount).toBe(1)

      const hits = await store.search({
        query: '敏感个人信息 单独同意',
        limit: 5,
        includeContent: true
      })
      expect(hits).toHaveLength(1)
      expect(hits[0]?.title).toBe('personal info')
      expect(hits[0]?.content).toContain('单独同意')
      expect(hits[0]?.category).toBe('法规规范')
      expect(hits[0]?.keywords?.length).toBeGreaterThan(0)

      const diagnostics = await store.diagnostics()
      expect(diagnostics.lastSelectedIds).toEqual([hits[0]?.documentId])
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('limits retrieval candidates to the selected knowledge folder', async () => {
    const root = await mkdtemp(join(tmpdir(), 'legalwork-kb-scope-'))
    const indexRoot = join(root, 'index')
    try {
      const store = new FileKnowledgeStore({
        rootDir: indexRoot,
        sourceRoots: [],
        nowIso: () => '2026-06-13T00:00:00.000Z'
      })

      await store.writeFile({
        path: '论文/行政法研究.md',
        content: '数字行政法研究关注算法行政与行政程序正当性。',
        encoding: 'utf8'
      })
      await store.writeFile({
        path: '经验分享/行政法办案.md',
        content: '数字行政法研究也会涉及律师办案经验与客户沟通。',
        encoding: 'utf8'
      })
      await store.sync()

      const hits = await store.search({
        query: '数字行政法研究',
        limit: 5,
        includeContent: true,
        pathPrefix: '论文'
      })

      expect(hits.length).toBeGreaterThan(0)
      expect(hits.every((hit) => hit.relativePath.startsWith('论文/'))).toBe(true)
      expect(hits.some((hit) => hit.relativePath.startsWith('经验分享/'))).toBe(false)
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('indexes managed files once and keeps paths relative to the managed root', async () => {
    const root = await mkdtemp(join(tmpdir(), 'legalwork-kb-managed-root-'))
    const indexRoot = join(root, 'knowledge')
    try {
      const store = new FileKnowledgeStore({
        rootDir: indexRoot,
        sourceRoots: [indexRoot],
        nowIso: () => '2026-06-13T00:00:00.000Z'
      })
      await store.writeFile({
        path: '论文/行政法.md',
        content: '行政法论文讨论数字政府的程序正当性。',
        encoding: 'utf8'
      })

      const sync = await store.sync()
      const hits = await store.search({
        query: '数字政府 程序正当性',
        limit: 5,
        includeContent: true,
        pathPrefix: '论文'
      })

      expect(sync.documentCount).toBe(1)
      expect(hits).toHaveLength(1)
      expect(hits[0]?.relativePath).toBe('论文/行政法.md')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('returns one citation source when several chunks match the same file', async () => {
    const root = await mkdtemp(join(tmpdir(), 'legalwork-kb-source-dedupe-'))
    const indexRoot = join(root, 'index')
    try {
      const store = new FileKnowledgeStore({
        rootDir: indexRoot,
        sourceRoots: [],
        nowIso: () => '2026-06-13T00:00:00.000Z'
      })
      await store.writeFile({
        path: '论文/长篇行政法研究.md',
        content: '算法行政应当遵守正当程序。\n'.repeat(500),
        encoding: 'utf8'
      })
      await store.sync()

      const result = await new KnowledgeRetrievalPipeline(store).retrieve('算法行政 正当程序', {
        pathPrefix: '论文'
      })

      expect(result.sources).toHaveLength(1)
      expect(result.sources[0]?.path).toBe('论文/长篇行政法研究.md')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('indexes files larger than the old upload-size guard', async () => {
    const root = await mkdtemp(join(tmpdir(), 'legalwork-kb-large-'))
    const sourceRoot = join(root, 'knowledge-base')
    const indexRoot = join(root, 'index')
    try {
      await mkdir(sourceRoot, { recursive: true })
      await writeFile(
        join(sourceRoot, 'large.md'),
        `${'背景材料\n'.repeat(300_000)}\n超大文件索引特征词\n`,
        { encoding: 'utf8' }
      )

      const store = new FileKnowledgeStore({
        rootDir: indexRoot,
        sourceRoots: [sourceRoot],
        nowIso: () => '2026-06-13T00:00:00.000Z'
      })

      const sync = await store.sync()
      expect(sync.documentCount).toBe(1)

      const hits = await store.search({
        query: '超大文件索引特征词',
        limit: 5,
        includeContent: true
      })
      expect(hits[0]?.content).toContain('超大文件索引特征词')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('classifies managed files into category folders and refreshes retrieval index', async () => {
    const root = await mkdtemp(join(tmpdir(), 'legalwork-kb-classify-'))
    const indexRoot = join(root, 'index')
    try {
      const store = new FileKnowledgeStore({
        rootDir: indexRoot,
        sourceRoots: [],
        nowIso: () => '2026-06-13T00:00:00.000Z'
      })

      await store.writeFile({
        path: '供应商合同审查.md',
        content: '供应商合同包含违约责任、解除条件和付款条款。',
        encoding: 'utf8'
      })
      await store.writeFile({
        path: '庭审证据目录.md',
        content: '本目录整理诉讼案件证据材料和质证意见。',
        encoding: 'utf8'
      })

      const result = await store.classify({ paths: ['供应商合同审查.md', '庭审证据目录.md'] })
      expect(result.moved.map((item) => item.destPath).sort()).toEqual([
        '合同协议/供应商合同审查.md',
        '诉讼仲裁/庭审证据目录.md'
      ])

      const tree = await store.tree()
      expect(tree.some((node) => node.path === '合同协议' && node.kind === 'folder')).toBe(true)
      expect(tree.some((node) => node.path === '诉讼仲裁' && node.kind === 'folder')).toBe(true)

      const hits = await store.search({
        query: '供应商 合同 违约责任',
        limit: 5,
        includeContent: false
      })
      expect(hits[0]?.relativePath).toBe('合同协议/供应商合同审查.md')
      expect(hits[0]?.category).toBe('合同协议')
      expect(hits[0]?.rankReason).toBeTruthy()
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('uses the model and file content when classifying managed files', async () => {
    const root = await mkdtemp(join(tmpdir(), 'legalwork-kb-model-classify-'))
    const indexRoot = join(root, 'index')
    const model = new StaticClassifierModel('{"category":"论文","reason":"正文是学术论文"}')
    try {
      const store = new FileKnowledgeStore({
        rootDir: indexRoot,
        sourceRoots: [],
        nowIso: () => '2026-06-13T00:00:00.000Z',
        model
      })

      await store.writeFile({
        path: '未命名资料.md',
        content: '摘要：本文研究个人信息保护中的告知同意规则。\n关键词：个人信息保护；告知同意\n参考文献：[1] 民法典。',
        encoding: 'utf8'
      })

      const result = await store.classify({ paths: ['未命名资料.md'] })

      expect(result.moved[0]?.destPath).toBe('论文/未命名资料.md')
      expect(result.moved[0]?.reason).toBe('正文是学术论文')
      expect(model.requests).toHaveLength(1)
      const classifierMessage = model.requests[0]?.history[0]
      expect(classifierMessage?.kind).toBe('user_message')
      expect(classifierMessage?.kind === 'user_message' ? classifierMessage.text : '').toContain('告知同意规则')
      expect(model.requests[0]?.responseFormat).toBe('json_object')
      expect(model.requests[0]?.temperature).toBe(0)
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('falls back to content-aware classification when no model is configured', async () => {
    const root = await mkdtemp(join(tmpdir(), 'legalwork-kb-content-classify-'))
    const indexRoot = join(root, 'index')
    try {
      const store = new FileKnowledgeStore({
        rootDir: indexRoot,
        sourceRoots: [],
        nowIso: () => '2026-06-13T00:00:00.000Z'
      })

      await store.writeFile({
        path: '材料.md',
        content: '摘要：本文围绕劳动争议案件中的举证责任展开研究。\n关键词：劳动争议；举证责任\n参考文献：最高人民法院司法解释。',
        encoding: 'utf8'
      })

      const result = await store.classify({ paths: ['材料.md'] })

      expect(result.moved[0]?.destPath).toBe('论文/材料.md')
      expect(result.moved[0]?.reason).toBe('正文包含论文结构')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('reports explicit coverage when maxFiles truncates the candidate set', async () => {
    const root = await mkdtemp(join(tmpdir(), 'legalwork-kb-coverage-'))
    const sourceRoot = join(root, 'knowledge-base')
    const indexRoot = join(root, 'index')
    try {
      await mkdir(sourceRoot, { recursive: true })
      await writeFile(join(sourceRoot, 'a.md'), '劳动合同解除规则 A', 'utf8')
      await writeFile(join(sourceRoot, 'b.md'), '劳动合同解除规则 B', 'utf8')
      await writeFile(join(sourceRoot, 'c.md'), '劳动合同解除规则 C', 'utf8')
      const store = new FileKnowledgeStore({ rootDir: indexRoot, sourceRoots: [sourceRoot] })

      const sync = await store.sync({ maxFiles: 2 })
      expect(sync.candidateFileCount).toBe(3)
      expect(sync.attemptedFileCount).toBe(2)
      expect(sync.documentCount).toBe(2)
      expect(sync.failedFileCount).toBe(0)
      expect(sync.truncatedFileCount).toBe(1)
      expect(sync.truncated).toBe(true)

      const diagnostics = await store.diagnostics()
      expect(diagnostics.candidateFileCount).toBe(3)
      expect(diagnostics.attemptedFileCount).toBe(2)
      expect(diagnostics.truncatedFileCount).toBe(1)
      expect(diagnostics.truncated).toBe(true)
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

})
