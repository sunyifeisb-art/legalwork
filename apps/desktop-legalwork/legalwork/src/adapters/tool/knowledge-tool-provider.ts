import type { CapabilityToolProvider } from './capability-registry.js'
import { LocalToolHost } from './local-tool-host.js'
import type { KnowledgeStore } from '../../knowledge/knowledge-store.js'
import type { KnowledgeLayer } from '../../contracts/knowledge.js'
import { readKnowledgeFileText } from '../../knowledge/knowledge-file-reader.js'
import {
  compactKnowledgeAutoRetrieveToolOutput,
  compactKnowledgeSearchToolOutput
} from './knowledge-tool-output.js'

export function buildKnowledgeToolProviders(store: KnowledgeStore | undefined): CapabilityToolProvider[] {
  if (!store) return []
  return [{
    id: 'knowledge',
    kind: 'knowledge',
    enabled: true,
    available: true,
    tools: [
      // ── Read / Browse ──────────────────────────────────────────
      LocalToolHost.defineTool({
        name: 'knowledge_search',
        description: 'Search the local legal knowledge base for relevant source files and compact excerpts by semantic keyword query. Returns ranked source references and snippets; use knowledge_read_file only when the exact full passage is needed. Supports pyramid layer filtering — pass a layer (principle, architecture, standard, implementation, experience) to narrow results. Do not call this again for the same question when knowledge_auto_retrieve already returned usable local evidence.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search query for legal terms, clauses, case names, or keywords' },
            limit: { type: 'number', minimum: 1, maximum: 20, description: 'Max results considered by retrieval (default 8, max 20); model-facing output is compacted further' },
            layer: { type: 'string', enum: ['principle', 'architecture', 'standard', 'implementation', 'experience'], description: 'Optional: restrict to a specific knowledge layer. The knowledge base has 5 layers: L1原则, L2架构, L3规范, L4实现, L5经验. Use this when you know what abstraction level you need.' }
          },
          required: ['query'],
          additionalProperties: false
        },
        policy: 'auto',
        execute: async (args) => {
          const query = typeof args.query === 'string' ? args.query.trim() : ''
          if (!query) return { output: { error: 'query is required' }, isError: true }
          const limit = typeof args.limit === 'number' && Number.isFinite(args.limit)
            ? Math.max(1, Math.min(20, Math.floor(args.limit)))
            : 8
          const layer = ['principle', 'architecture', 'standard', 'implementation', 'experience'].includes(args.layer as string)
            ? args.layer as KnowledgeLayer
            : undefined
          const sources = await store.search({ query, limit, includeContent: true, layer })
          return {
            output: compactKnowledgeSearchToolOutput({
              query,
              layer: layer ?? 'all',
              sources
            })
          }
        }
      }),
      LocalToolHost.defineTool({
        name: 'knowledge_list_tree',
        description: 'List the managed knowledge base file/folder tree structure. Use this to discover what documents are available in the knowledge base before searching or reading. Returns folders first, then files, alphabetically sorted.',
        inputSchema: {
          type: 'object',
          properties: {
            prefix: { type: 'string', description: 'Optional subfolder path to list contents of a specific directory. Omit to list from root.' }
          },
          additionalProperties: false
        },
        policy: 'auto',
        execute: async (args) => {
          const prefix = typeof args.prefix === 'string' && args.prefix.trim() ? args.prefix.trim() : undefined
          return {
            output: {
              nodes: await store.tree(prefix)
            }
          }
        }
      }),
      LocalToolHost.defineTool({
        name: 'knowledge_read_file',
        description: 'Read model-consumable text from a specific file in the managed knowledge base by relative path. Text files are read as UTF-8; PDF/Office/image documents use the same extraction/OCR pipeline as indexing. Returns at most the first 200 lines (or a page via offset/limit) to bound token cost; use offset to continue reading a large document page by page.',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'Relative file path within the knowledge base (e.g. "contracts/NDA.md" or "法规/民法典.pdf")' },
            offset: { type: 'number', description: '1-based starting line. Default 1.' },
            limit: { type: 'number', description: 'Max lines to return. Default 200, max 500.' }
          },
          required: ['path'],
          additionalProperties: false
        },
        policy: 'auto',
        execute: async (args) => {
          const filePath = typeof args.path === 'string' ? args.path.trim() : ''
          if (!filePath) return { output: { error: 'path is required' }, isError: true }
          try {
            const result = await readKnowledgeFileText(store, filePath)
            const allLines = result.content.split('\n')
            const offset = Math.max(1, Math.floor(Number(args.offset) || 1))
            const limit = Math.max(1, Math.min(500, Math.floor(Number(args.limit) || 200)))
            if (offset > allLines.length) {
              return {
                output: {
                  path: result.path,
                  error: `offset ${offset} is beyond the file's ${allLines.length} lines; use offset=${Math.max(1, allLines.length)} or lower.`,
                  total_lines: allLines.length
                },
                isError: true
              }
            }
            const selected = allLines.slice(offset - 1, offset - 1 + limit)
            const content = selected.join('\n')
            const endLine = Math.min(allLines.length, offset - 1 + selected.length)
            const truncated = endLine < allLines.length
            const output = {
              path: result.path,
              encoding: result.encoding,
              extraction_method: result.extractionMethod,
              content,
              start_line: offset,
              end_line: endLine,
              total_lines: allLines.length,
              truncated,
              ...(truncated
                ? { note: `[showing lines ${offset}-${endLine} of ${allLines.length}. Use offset=${endLine + 1} to continue reading.]` }
                : {})
            }
            return { output }
          } catch (error) {
            return { output: { error: `failed to read file: ${error instanceof Error ? error.message : String(error)}` }, isError: true }
          }
        }
      }),

      // ── Write / Create ─────────────────────────────────────────
      LocalToolHost.defineTool({
        name: 'knowledge_write_file',
        description: 'Create or overwrite a file in the managed knowledge base. The content is plain text (UTF-8). Use this to save generated documents, legal memos, research notes, or any text content into the knowledge base for future reference.',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'Relative file path within the knowledge base (e.g. "memos/分析报告.md" or "合同审查/2024-供应商合同.md"). Parent folders are auto-created.' },
            content: { type: 'string', description: 'File content as plain UTF-8 text' }
          },
          required: ['path', 'content'],
          additionalProperties: false
        },
        policy: 'auto',
        execute: async (args) => {
          const filePath = typeof args.path === 'string' ? args.path.trim() : ''
          const content = typeof args.content === 'string' ? args.content : ''
          if (!filePath) return { output: { error: 'path is required' }, isError: true }
          try {
            const result = await store.writeFile({ path: filePath, content, encoding: 'utf8' })
            return { output: result }
          } catch (error) {
            return { output: { error: `failed to write file: ${error instanceof Error ? error.message : String(error)}` }, isError: true }
          }
        }
      }),
      LocalToolHost.defineTool({
        name: 'knowledge_create_folder',
        description: 'Create a new folder in the managed knowledge base. Use this to organize documents into categories (e.g. "合同审查", "法规汇编", "案例研究"). Parent folders are auto-created.',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'Relative folder path (e.g. "项目文档/2024")' }
          },
          additionalProperties: false
        },
        policy: 'auto',
        execute: async (args) => {
          const folderPath = typeof args.path === 'string' ? args.path.trim() : undefined
          if (!folderPath) return { output: { error: 'path is required' }, isError: true }
          try {
            const result = await store.createFolder({ path: folderPath })
            return { output: result }
          } catch (error) {
            return { output: { error: `failed to create folder: ${error instanceof Error ? error.message : String(error)}` }, isError: true }
          }
        }
      }),

      // ── Organize ───────────────────────────────────────────────
      LocalToolHost.defineTool({
        name: 'knowledge_move',
        description: 'Move or rename a file or folder within the managed knowledge base. Use this to reorganize documents, fix naming, or move files between folders. Works for both files and folders.',
        inputSchema: {
          type: 'object',
          properties: {
            sourcePath: { type: 'string', description: 'Current relative path of the file or folder' },
            destPath: { type: 'string', description: 'New relative path (can include different parent folder for move, or just new name for rename)' }
          },
          required: ['sourcePath', 'destPath'],
          additionalProperties: false
        },
        policy: 'auto',
        execute: async (args) => {
          const sourcePath = typeof args.sourcePath === 'string' ? args.sourcePath.trim() : ''
          const destPath = typeof args.destPath === 'string' ? args.destPath.trim() : ''
          if (!sourcePath || !destPath) return { output: { error: 'sourcePath and destPath are required' }, isError: true }
          try {
            const result = await store.move({ sourcePath, destPath })
            return { output: result }
          } catch (error) {
            return { output: { error: `failed to move: ${error instanceof Error ? error.message : String(error)}` }, isError: true }
          }
        }
      }),
      LocalToolHost.defineTool({
        name: 'knowledge_classify',
        description: 'Automatically classify managed knowledge-base files into practical category folders such as 法规规范, 合同协议, 诉讼仲裁, 案例判例, 调研报告, 模板范本, 音视频, 图片资料, 表格数据, and 其他资料. Use this after uploading mixed files or when the user asks to整理/分类 the knowledge base.',
        inputSchema: {
          type: 'object',
          properties: {
            paths: {
              type: 'array',
              items: { type: 'string' },
              description: 'Optional selected relative file/folder paths. Omit to classify all managed files.'
            },
            targetRoot: { type: 'string', description: 'Optional root folder under which category folders should be created.' },
            dryRun: { type: 'boolean', description: 'Preview planned moves without changing files.' }
          },
          additionalProperties: false
        },
        policy: 'auto',
        execute: async (args) => {
          const paths = Array.isArray(args.paths)
            ? args.paths.filter((path): path is string => typeof path === 'string' && path.trim().length > 0)
            : undefined
          const targetRoot = typeof args.targetRoot === 'string' ? args.targetRoot.trim() : undefined
          const dryRun = args.dryRun === true
          try {
            const result = await store.classify({ paths, targetRoot, dryRun })
            return { output: result }
          } catch (error) {
            return { output: { error: `failed to classify: ${error instanceof Error ? error.message : String(error)}` }, isError: true }
          }
        }
      }),
      LocalToolHost.defineTool({
        name: 'knowledge_delete',
        description: 'Delete a file or folder from the managed knowledge base. Folder deletion is recursive. Use this to clean up outdated or incorrect documents. Cannot be undone.',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'Relative path of the file or folder' }
          },
          required: ['path'],
          additionalProperties: false
        },
        policy: 'auto',
        execute: async (args) => {
          const filePath = typeof args.path === 'string' ? args.path.trim() : ''
          if (!filePath) return { output: { error: 'path is required' }, isError: true }
          try {
            const result = await store.delete(filePath)
            return { output: result }
          } catch (error) {
            return { output: { error: `failed to delete: ${error instanceof Error ? error.message : String(error)}` }, isError: true }
          }
        }
      }),

      // ── Maintain ───────────────────────────────────────────────
      LocalToolHost.defineTool({
        name: 'knowledge_sync',
        description: 'Trigger a full sync of the knowledge base. Scans source directories, ingests new/modified text files, chunks them, and rebuilds the search index. Use this after adding files externally (e.g. via the file system) to make them searchable.',
        inputSchema: {
          type: 'object',
          properties: {
            maxFiles: { type: 'number', minimum: 1, maximum: 5000, description: 'Max files to process (default 1500)' }
          },
          additionalProperties: false
        },
        policy: 'auto',
        execute: async (args) => {
          const maxFiles = typeof args.maxFiles === 'number' && Number.isFinite(args.maxFiles)
            ? Math.max(1, Math.min(5000, Math.floor(args.maxFiles)))
            : 1500
          return {
            output: await store.sync({ maxFiles })
          }
        }
      }),
      LocalToolHost.defineTool({
        name: 'knowledge_diagnostics',
        description: 'Get the current status and statistics of the knowledge base. Returns document count, chunk count, sync timestamp, enabled state, and source roots. Use this to check whether the knowledge base is ready before searching.',
        inputSchema: {
          type: 'object',
          properties: {},
          additionalProperties: false
        },
        policy: 'auto',
        execute: async () => {
          return {
            output: await store.diagnostics()
          }
        }
      }),

      // ── Auto Retrieval ──────────────────────────────────────────
      LocalToolHost.defineTool({
        name: 'knowledge_auto_retrieve',
        description: 'One-step compact local knowledge retrieval for a user question or task. Returns one bounded context block plus lightweight source references; call knowledge_read_file only when an exact full passage is required. Choose this OR knowledge_search for the initial local retrieval instead of calling both with near-identical queries. Supports pyramid layer routing — optionally specify principle, architecture, standard, implementation, or experience.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'The user question or task that needs knowledge context' },
            excludeExpired: { type: 'boolean', description: 'Whether to filter out expired/deprecated content (default true)' },
            layer: { type: 'string', enum: ['principle', 'architecture', 'standard', 'implementation', 'experience'], description: 'Optional: restrict search to a specific pyramid knowledge layer (L1-L5). Auto-detected from query when omitted.' }
          },
          required: ['query'],
          additionalProperties: false
        },
        policy: 'auto',
        execute: async (args) => {
          const query = typeof args.query === 'string' ? args.query.trim() : ''
          if (!query) return { output: { error: 'query is required' }, isError: true }
          const excludeExpired = args.excludeExpired !== false
          const layer = ['principle', 'architecture', 'standard', 'implementation', 'experience'].includes(args.layer as string)
            ? args.layer as KnowledgeLayer
            : undefined

          // Dynamic import to avoid circular dependency
          const { KnowledgeRetrievalPipeline } = await import('../../knowledge/knowledge-retrieval-pipeline.js')
          const pipeline = new KnowledgeRetrievalPipeline(store)
          const result = await pipeline.retrieve(query, { excludeExpired, layer })
          return { output: compactKnowledgeAutoRetrieveToolOutput(result) }
        }
      }),
      LocalToolHost.defineTool({
        name: 'knowledge_legal_external_sources',
        description: 'Search authoritative legal external sources for current regulations, cases, and legal interpretations. For National Laws and Regulations Database citations, use the verified canonical records.path returned by this tool; never cite flk.npc.gov.cn/index?... as a statute detail page.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'The legal topic to search for externally' }
          },
          required: ['query'],
          additionalProperties: false
        },
        policy: 'auto',
        execute: async (args) => {
          const query = typeof args.query === 'string' ? args.query.trim() : ''
          if (!query) return { output: { error: 'query is required' }, isError: true }

          const { legalExternalSearch } = await import('../../knowledge/legal-external-search.js')
          const result = await legalExternalSearch(query)
          return { output: result }
        }
      }),

      // ── Writing Style ───────────────────────────────────────────
      // ── Citation Verification ──────────────────────────────────────
      LocalToolHost.defineTool({
        name: 'knowledge_citation_verify',
        description: 'Verify all citations in a completed paper draft against the knowledge base index. Extracts citation markers ([1], [2,3], [1-3]), cross-references each one against stored documents, and reports any unverifiable or misattributed citations. Use this AFTER drafting a paper or legal document and BEFORE delivering it. Only works on drafts that use [N] format citation markers.',
        inputSchema: {
          type: 'object',
          properties: {
            draft: { type: 'string', description: 'The complete paper or document draft text containing [N] format citation markers' }
          },
          required: ['draft'],
          additionalProperties: false
        },
        policy: 'auto',
        execute: async (args) => {
          const draft = typeof args.draft === 'string' ? args.draft : ''
          if (!draft) return { output: { error: 'draft is required' }, isError: true }

          const diagnostics = await store.diagnostics()
          if (diagnostics.documentCount === 0) {
            return {
              output: {
                documentStats: { totalCitations: 0, verified: 0, notFound: 0, contentMismatch: 0, suspicious: 0 },
                checks: [],
                recommendations: ['知识库为空，无法核验引用。请先同步知识库。']
              }
            }
          }

          // Extract citations, then search KB for each one
          const { extractCitations, verifyPaperCitations } = await import('../../knowledge/citation-verifier.js')
          const citations = extractCitations(draft)
          const uniqueCitations = [...new Set(citations.map((c) => c.rawText))]

          // Build a lightweight index from search results
          const allDocs: Array<{ title: string; relativePath: string; keywords?: string[] }> = []
          for (const rawText of uniqueCitations.slice(0, 20)) {
            const cleanText = rawText.replace(/[[\]\d]/g, '').trim()
            if (cleanText.length < 2) continue
            const hits = await store.search({ query: cleanText, limit: 5 })
            for (const hit of hits) {
              if (!allDocs.some((d) => d.relativePath === hit.relativePath)) {
                allDocs.push({
                  title: hit.title,
                  relativePath: hit.relativePath,
                  keywords: hit.keywords
                })
              }
            }
          }

          const result = verifyPaperCitations(draft, {
            documents: allDocs as any,
            chunks: []
          })
          return { output: result }
        }
      }),
      LocalToolHost.defineTool({
        name: 'knowledge_writing_style',
        description: 'Get the team writing style guide including legal syllogism structure, argumentation rhythm, citation requirements, document type templates (complaint, defense, legal opinion, agency opinion), and risk warning templates. Use this when drafting any legal document to ensure consistent team style.',
        inputSchema: {
          type: 'object',
          properties: {
            documentType: { type: 'string', description: 'Optional document type: "complaint", "defense", "legalOpinion", "agencyOpinion"' }
          },
          additionalProperties: false
        },
        policy: 'auto',
        execute: async (args) => {
          const documentType = typeof args.documentType === 'string' ? args.documentType.trim() : undefined
          const { buildWritingStyleInstruction } = await import('../../knowledge/writing-style.js')
          const instruction = buildWritingStyleInstruction(documentType)
          return {
            output: {
              documentType: documentType ?? 'generic',
              instruction,
              principles: [
                '法律三段论结构（大前提→小前提→结论）',
                '请求权基础分析方法',
                '每个论点必须有法律依据或案例支撑'
              ]
            }
          }
        }
      })
    ]
  }]
}
