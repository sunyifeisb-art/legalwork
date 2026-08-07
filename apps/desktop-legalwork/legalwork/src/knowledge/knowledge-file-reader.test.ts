import { describe, expect, it, vi } from 'vitest'
import type { KnowledgeStore } from './knowledge-store.js'
import { readKnowledgeFileText } from './knowledge-file-reader.js'

function fakeStore(): KnowledgeStore {
  return {
    sync: vi.fn(),
    search: vi.fn(),
    diagnostics: vi.fn(),
    setLastSelected: vi.fn(),
    tree: vi.fn(),
    createFolder: vi.fn(),
    writeFile: vi.fn(),
    readFile: vi.fn(async (path: string) => ({ path, content: 'plain text', encoding: 'utf8' as const })),
    extractText: vi.fn(async (path: string) => ({ path, text: 'extracted document text', extension: '.pdf' })),
    absolutePath: vi.fn(),
    move: vi.fn(),
    delete: vi.fn(),
    classify: vi.fn()
  } as unknown as KnowledgeStore
}

describe('readKnowledgeFileText', () => {
  it('uses document extraction for PDF and office formats instead of UTF-8 package reads', async () => {
    const store = fakeStore()

    const result = await readKnowledgeFileText(store, '案件材料/判决书.pdf')

    expect(store.extractText).toHaveBeenCalledWith('案件材料/判决书.pdf')
    expect(store.readFile).not.toHaveBeenCalled()
    expect(result).toEqual({
      path: '案件材料/判决书.pdf',
      content: 'extracted document text',
      encoding: 'utf8',
      extractionMethod: 'document-text'
    })
  })

  it('keeps plain text files on the direct UTF-8 path', async () => {
    const store = fakeStore()

    const result = await readKnowledgeFileText(store, '经验分享/办案笔记.md')

    expect(store.readFile).toHaveBeenCalledWith('经验分享/办案笔记.md', 'utf8')
    expect(store.extractText).not.toHaveBeenCalled()
    expect(result.extractionMethod).toBe('utf8-read')
    expect(result.content).toBe('plain text')
  })

  it('fails explicitly when a binary document has no extractable text', async () => {
    const store = fakeStore()
    vi.mocked(store.extractText).mockResolvedValue({
      path: '扫描件.pdf',
      text: '',
      extension: '.pdf'
    })

    await expect(readKnowledgeFileText(store, '扫描件.pdf')).rejects.toThrow(
      'no extractable text found in 扫描件.pdf'
    )
    expect(store.readFile).not.toHaveBeenCalled()
  })
})
