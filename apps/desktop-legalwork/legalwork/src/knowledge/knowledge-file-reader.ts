import type { KnowledgeStore } from './knowledge-store.js'

const EXTRACTED_DOCUMENT_RE = /\.(?:pdf|docx?|pptx?|xlsx?|png|jpe?g|webp|bmp|tiff?)$/i

export type KnowledgeFileText = {
  path: string
  content: string
  encoding: 'utf8'
  extractionMethod: 'document-text' | 'utf8-read'
}

/**
 * Read model-consumable text from a managed knowledge-base file.
 *
 * Binary office/PDF/image formats must go through the existing document
 * extractor. Reading those packages as UTF-8 produces ZIP/PDF binary noise and
 * makes `knowledge_read_file` contradict the text that was successfully
 * indexed during sync.
 */
export async function readKnowledgeFileText(
  store: KnowledgeStore,
  filePath: string
): Promise<KnowledgeFileText> {
  if (EXTRACTED_DOCUMENT_RE.test(filePath)) {
    const extracted = await store.extractText(filePath)
    const content = extracted.text ?? ''
    if (!content.trim()) {
      throw new Error(`no extractable text found in ${filePath}`)
    }
    return {
      path: extracted.path,
      content,
      encoding: 'utf8',
      extractionMethod: 'document-text'
    }
  }

  const result = await store.readFile(filePath, 'utf8')
  if (result.encoding !== 'utf8') {
    throw new Error(`expected UTF-8 text for ${filePath}, received ${result.encoding}`)
  }
  return {
    path: result.path,
    content: result.content,
    encoding: 'utf8',
    extractionMethod: 'utf8-read'
  }
}
