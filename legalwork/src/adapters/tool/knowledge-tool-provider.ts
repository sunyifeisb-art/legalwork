import type { CapabilityToolProvider } from './capability-registry.js'
import { LocalToolHost } from './local-tool-host.js'
import type { KnowledgeStore } from '../../knowledge/knowledge-store.js'

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
        description: 'Search the local legal knowledge base for relevant source files and excerpts by semantic keyword query. Returns ranked chunk snippets with source metadata (file path, score, excerpt). Use this when you need to find relevant legal provisions, contract clauses, or case materials.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search query for legal terms, clauses, case names, or keywords' },
            limit: { type: 'number', minimum: 1, maximum: 20, description: 'Max results (default 8, max 20)' }
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
          return {
            output: {
              query,
              sources: await store.search({ query, limit, includeContent: true })
            }
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
        description: 'Read the full content of a specific file from the managed knowledge base by its relative path. Use this after knowledge_list_tree or knowledge_search to get the complete document text for detailed analysis, summarization, or citation.',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'Relative file path within the knowledge base (e.g. "contracts/NDA.md" or "法规/民法典.md")' }
          },
          required: ['path'],
          additionalProperties: false
        },
        policy: 'auto',
        execute: async (args) => {
          const filePath = typeof args.path === 'string' ? args.path.trim() : ''
          if (!filePath) return { output: { error: 'path is required' }, isError: true }
          try {
            const result = await store.readFile(filePath)
            return { output: result }
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
          required: ['path'],
          additionalProperties: false
        },
        policy: 'auto',
        execute: async (args) => {
          const folderPath = typeof args.path === 'string' ? args.path.trim() : ''
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
        name: 'knowledge_delete',
        description: 'Delete a file or folder from the managed knowledge base. Folder deletion is recursive. Use this to clean up outdated or incorrect documents. Cannot be undone.',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'Relative path of the file or folder to delete' }
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
        description: 'One-step auto-retrieval: given a user question or task description, automatically searches the knowledge base for relevant documents, checks for expired/deprecated content, and returns a formatted context block with source citations ready for model injection. Use this at the start of any legal writing or QA task to gather all relevant team knowledge.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'The user question or task that needs knowledge context' },
            excludeExpired: { type: 'boolean', description: 'Whether to filter out expired/deprecated content (default true)' }
          },
          required: ['query'],
          additionalProperties: false
        },
        policy: 'auto',
        execute: async (args) => {
          const query = typeof args.query === 'string' ? args.query.trim() : ''
          if (!query) return { output: { error: 'query is required' }, isError: true }
          const excludeExpired = args.excludeExpired !== false

          // Dynamic import to avoid circular dependency
          const { KnowledgeRetrievalPipeline } = await import('../../knowledge/knowledge-retrieval-pipeline.js')
          const pipeline = new KnowledgeRetrievalPipeline(store)
          const result = await pipeline.retrieve(query, { excludeExpired })
          return { output: result }
        }
      }),
      LocalToolHost.defineTool({
        name: 'knowledge_legal_external_sources',
        description: 'Get a list of authoritative legal external sources (official government websites, judicial databases, academic legal platforms) that can be consulted for the latest regulations, cases, and legal interpretations. Use this when you need to find the most current legal information beyond the local knowledge base.',
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
