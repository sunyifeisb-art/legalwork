import { resolve } from 'path'
import { readFileSync } from 'fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: resolve(__dirname, 'src/renderer'),
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://127.0.0.1:5100',
      '/result': 'http://127.0.0.1:5100'
    }
  },
  resolve: {
    alias: {
      '@renderer': resolve(__dirname, 'src/renderer/src'),
      '@shared': resolve(__dirname, 'src/shared')
    }
  },
  plugins: [
    react(),
    // Serve dev mock for window.dsGui as an external script
    {
      name: 'dev-mock-dsgui',
      configureServer(server) {
        server.middlewares.use('/__dev-mock-dsgui.cjs', (_req, res) => {
          res.setHeader('Content-Type', 'application/javascript')
          res.setHeader('Cache-Control', 'no-cache')
          const content = readFileSync(
            resolve(__dirname, 'src/renderer/src/dev-mock-dsgui.cjs'),
            'utf-8'
          )
          res.end(content)
        })
      },
      transformIndexHtml(html) {
        // Add the mock script tag and relax CSP for dev
        return html
          .replace(
            'script-src \'self\'',
            'script-src \'self\' \'unsafe-inline\''
          )
          .replace(
            '</head>',
            '  <script src="/__dev-mock-dsgui.cjs"></script>\n</head>'
          )
      }
    }
  ]
})
