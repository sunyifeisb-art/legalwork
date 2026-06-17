import { cpSync, mkdirSync } from 'fs'
import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

function copyPdfJsAssetsPlugin() {
  return {
    name: 'copy-pdfjs-assets',
    closeBundle(): void {
      const targetRoot = resolve('out/renderer/pdfjs')
      mkdirSync(targetRoot, { recursive: true })
      cpSync(resolve('node_modules/pdfjs-dist/cmaps'), resolve(targetRoot, 'cmaps'), {
        recursive: true,
        force: true
      })
      cpSync(resolve('node_modules/pdfjs-dist/standard_fonts'), resolve(targetRoot, 'standard_fonts'), {
        recursive: true,
        force: true
      })
    }
  }
}

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve('src/main/index.ts'),
          'claw-schedule-mcp-node-entry': resolve('src/main/claw-schedule-mcp-node-entry.ts')
        },
        output: {
          format: 'cjs',
          entryFileNames: '[name].cjs'
        }
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        output: {
          format: 'cjs',
          entryFileNames: '[name].cjs'
        }
      }
    }
  },
  renderer: {
    server: {
      proxy: {
        '/api': 'http://127.0.0.1:5100',
        '/result': 'http://127.0.0.1:5100'
      }
    },
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@shared': resolve('src/shared')
      }
    },
    plugins: [react(), copyPdfJsAssetsPlugin()]
  }
})
