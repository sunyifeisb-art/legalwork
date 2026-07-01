import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { describe, expect, it } from 'vitest'
import { FileKnowledgeStore } from './knowledge-store.js'

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
})
