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

      const diagnostics = await store.diagnostics()
      expect(diagnostics.lastSelectedIds).toEqual([hits[0]?.documentId])
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })
})
