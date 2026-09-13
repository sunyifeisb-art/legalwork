import type { MermaidConfig } from '@streamdown/mermaid'
import {
  Check,
  Copy,
  Download,
  Maximize2,
  Minus,
  Plus,
  RotateCcw,
  X
} from 'lucide-react'
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactElement
} from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { uiFontStack } from '../../lib/platform-fonts'

const COPY_RESET_MS = 2000
const MIN_ZOOM = 0.55
const MAX_ZOOM = 2
const ZOOM_STEP = 0.15
const MIN_DIAGRAM_WIDTH = 240
const MAX_DIAGRAM_WIDTH = 2400
const DEFAULT_FONT_SIZE = 15
const MIN_FONT_SIZE = 12
const LIGHT_TEXT_WEIGHT = 40
const HEAVY_TEXT_WEIGHT = 520
const MERMAID_DIRECTIVE_WORDS =
  /\b(?:flowchart|graph|sequenceDiagram|classDiagram|classDiagram-v2|stateDiagram|stateDiagram-v2|erDiagram|journey|gantt|pie|quadrantChart|requirementDiagram|gitGraph|mindmap|timeline|zenuml|sankey-beta|xychart-beta|block-beta|packet-beta|kanban|architecture-beta|subgraph|end|direction|LR|RL|TB|BT|TD|click|linkStyle|style|classDef|accTitle|accDescr)\b/g
const VIEWBOX_REGEX = /<svg\b[^>]*\bviewBox=(['"])([^'"]+)\1/i
const FOREIGN_OBJECT_REGEX = /<foreignObject\b([^>]*)>/g
const MERMAID_SOURCE_REGEX =
  /^\s*(?:---[\s\S]*?---\s*)?(?:flowchart|graph|sequenceDiagram|classDiagram(?:-v2)?|stateDiagram(?:-v2)?|erDiagram|journey|gantt|pie|quadrantChart|requirementDiagram|gitGraph|C4Context|mindmap|timeline|zenuml|sankey-beta|xychart-beta|block-beta|packet-beta|kanban|architecture-beta)\b/i

type DiagramTheme = 'light' | 'dark'
type RenderState =
  | { status: 'idle' | 'loading' }
  | { status: 'ready'; svg: string; width: number }
  | { status: 'error'; message: string }

/**
 * Last successfully rendered diagram, scoped to its source+theme so a
 * re-render (theme switch, retry) only reuses a diagram that belongs to the
 * same source. Without the scope, an error/retry or a new message could flash
 * an unrelated diagram from an earlier message.
 */
type LastReadyDiagram = {
  source: string
  theme: DiagramTheme
  svg: string
  width: number
}

let mermaidRenderQueue: Promise<void> = Promise.resolve()

/**
 * Render results are cached per (source, theme) so scrolling back to a
 * diagram, a theme re-render, or a streamed source settling on its final
 * text does not re-run the expensive Mermaid render or flash back to the
 * loading spinner. Bounded FIFO to keep memory from growing unbounded on
 * long chats.
 */
type MermaidRenderResult = { svg: string; width: number }
const MERMAID_SVG_CACHE_MAX = 24
const mermaidSvgCache = new Map<string, MermaidRenderResult>()

function mermaidCacheKey(source: string, theme: DiagramTheme): string {
  return `${theme}:${source}`
}

function enqueueMermaidRender<T>(job: () => Promise<T>): Promise<T> {
  const result = mermaidRenderQueue.then(job, job)
  mermaidRenderQueue = result.then(
    () => undefined,
    () => undefined
  )
  return result
}

function currentTheme(): DiagramTheme {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

function useDiagramTheme(): DiagramTheme {
  const [theme, setTheme] = useState<DiagramTheme>(currentTheme)

  useEffect(() => {
    const root = document.documentElement
    const update = (): void => setTheme(currentTheme())
    const observer = new MutationObserver(update)
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  return theme
}

export function isMermaidLanguage(language: string): boolean {
  return ['mermaid', 'mmd'].includes(language.trim().toLowerCase())
}

export function looksLikeMermaidSource(source: string): boolean {
  return MERMAID_SOURCE_REGEX.test(source)
}

export function diagramWidthFromSvg(svg: string): number {
  const viewBox = svg.match(VIEWBOX_REGEX)?.[2]?.trim().split(/[\s,]+/).map(Number)
  const width = viewBox?.length === 4 ? viewBox[2] : Number.NaN
  if (!Number.isFinite(width) || width <= 0) return MIN_DIAGRAM_WIDTH
  return Math.max(MIN_DIAGRAM_WIDTH, Math.min(MAX_DIAGRAM_WIDTH, width))
}

export function ensureMermaidLabelVisibility(svg: string): string {
  return svg.replace(FOREIGN_OBJECT_REGEX, (tag, attributes: string) => {
    if (/\boverflow\s*=/.test(attributes)) {
      return tag.replace(/\boverflow\s*=\s*(['"])[^'"]*\1/, 'overflow="visible"')
    }
    return `<foreignObject overflow="visible"${attributes}>`
  })
}

/**
 * Mermaid measures label widths in a detached document, so CJK glyphs can come
 * out a few pixels wider than the layout assumed once the SVG lands in the chat
 * context. The root <svg> clips anything past the viewBox, which cuts off those
 * few stray pixels. Widen the viewBox symmetrically (without rescaling the
 * content, which stays 1:1 and centered) so the overflow has room to render.
 */
export function expandSvgViewBox(svg: string): string {
  const match = svg.match(VIEWBOX_REGEX)
  if (!match) return svg
  const numbers = match[2].trim().split(/[\s,]+/).map(Number)
  if (
    numbers.length !== 4 ||
    !numbers.every(Number.isFinite) ||
    numbers[2] <= 0 ||
    numbers[3] <= 0
  ) {
    return svg
  }
  const [x, y, width, height] = numbers
  const padX = Math.max(20, Math.round(width * 0.05))
  const padY = Math.max(20, Math.round(height * 0.05))
  const value = `${x - padX} ${y - padY} ${width + padX * 2} ${height + padY * 2}`
  return svg.replace(`${match[1]}${match[2]}${match[1]}`, `${match[1]}${value}${match[1]}`)
}

/**
 * Approximate how much label text a Mermaid diagram carries. Full-width glyphs
 * (CJK) are wider than Latin glyphs, so they weigh 1.0 while letters/digits
 * weigh 0.5. Syntax markers are stripped first so only real label text counts.
 */
export function estimateLabelChars(source: string): number {
  const text = source
    .replace(/^\s*---[\s\S]*?---\s*/u, '')
    .replace(/%%[^\n]*/g, ' ')
    .replace(MERMAID_DIRECTIVE_WORDS, ' ')
    .replace(/\[|\]/g, ' ')
    .replace(/[{}()<>|:;#~"'`&!+*\\=\-,.]/g, ' ')
    .replace(/\s+/g, '')
  let weight = 0
  for (const ch of text) {
    if (/[⺀-鿿豈-﫿]/u.test(ch)) weight += 1
    else if (/[a-zA-Z0-9]/.test(ch)) weight += 0.5
    else weight += 0.2
  }
  return weight
}

/**
 * Pick a base font size that adapts to how much text a diagram holds: short
 * diagrams keep a comfortable 15px, text-heavy ones shrink toward 12px so the
 * boxes, connectors and glyphs stay compact instead of blowing up.
 */
export function adaptiveFontSize(source: string): number {
  const weight = estimateLabelChars(source)
  if (weight <= LIGHT_TEXT_WEIGHT) return DEFAULT_FONT_SIZE
  if (weight >= HEAVY_TEXT_WEIGHT) return MIN_FONT_SIZE
  const t = (weight - LIGHT_TEXT_WEIGHT) / (HEAVY_TEXT_WEIGHT - LIGHT_TEXT_WEIGHT)
  return Math.round((DEFAULT_FONT_SIZE - (DEFAULT_FONT_SIZE - MIN_FONT_SIZE) * t) * 10) / 10
}

/**
 * 轻量修复 agent 生成 Mermaid 的常见语法错误（仅在原语法渲染失败时调用，
 * 成功的图不会被改动）：
 * 1. 首行/图表开头只有方向（TD/LR/TB/BT/RL）→ 补成 `flowchart <方向>`。
 * 2. `subgraph 中文标签（全角符号）` 未加引号 → 包一层合法 ID 与引号标签。
 */
function repairMermaidSource(source: string): string {
  const lines = source.split('\n')
  // 跳过开头的 YAML frontmatter 注释，找第一个非空、非注释行。
  let firstIdx = 0
  for (let i = 0; i < lines.length; i += 1) {
    const trimmed = lines[i].trim()
    if (trimmed === '' || trimmed.startsWith('---') || trimmed.startsWith('%%') || trimmed.startsWith('//')) continue
    firstIdx = i
    break
  }
  const first = lines[firstIdx]?.trim() ?? ''
  if (/^(?:TD|LR|TB|BT|RL)$/.test(first)) {
    lines[firstIdx] = `flowchart ${first}`
  }

  const repaired = lines
    .map((line) => {
      const match = line.match(/^(\s*subgraph\s+)(.+?)(\s*)$/)
      if (!match) return line
      const [, prefix, rawLabel, suffix] = match
      const label = rawLabel.trim()
      // 已是合法 ID 或带引号/方括号的标签则不动。
      if (/^[A-Za-z0-9_-]+$/.test(label)) return line
      if (/^[["']/.test(label) || /[\]"']$/.test(label)) return line
      // 含全角符号等易导致 Lexical error 的字符 → 用引号包裹并给个稳定 ID。
      const safeId = label.replace(/[^\w一-龥]/g, '_').replace(/^_+|_+$/g, '') || 's'
      return `${prefix}${safeId}["${label}"]${suffix}`
    })
    .join('\n')
  return repaired === source ? source : repaired
}

function mermaidConfig(
  theme: DiagramTheme,
  fontSize: number = DEFAULT_FONT_SIZE
): MermaidConfig {
  const dark = theme === 'dark'
  // Keep connector spacing proportional to the font so a compact (text-heavy)
  // diagram doesn't end up with oversized gaps between nodes.
  const spacing = fontSize / DEFAULT_FONT_SIZE
  return {
    startOnLoad: false,
    securityLevel: 'strict',
    suppressErrorRendering: true,
    theme: 'base',
    fontFamily: uiFontStack(),
    themeVariables: dark
      ? {
          background: '#17181c',
          primaryColor: '#24262b',
          primaryTextColor: '#f5f5f7',
          primaryBorderColor: '#555a65',
          secondaryColor: '#1e2938',
          tertiaryColor: '#202226',
          lineColor: '#8993a4',
          textColor: '#f5f5f7',
          edgeLabelBackground: '#17181c',
          clusterBkg: '#202226',
          clusterBorder: '#454a54',
          fontSize: `${fontSize}px`
        }
      : {
          background: '#ffffff',
          primaryColor: '#f7f9fc',
          primaryTextColor: '#1d1d1f',
          primaryBorderColor: '#c8d0dc',
          secondaryColor: '#edf4ff',
          tertiaryColor: '#f7f8fa',
          lineColor: '#778397',
          textColor: '#1d1d1f',
          edgeLabelBackground: '#ffffff',
          clusterBkg: '#f7f8fa',
          clusterBorder: '#d8dde6',
          fontSize: `${fontSize}px`
        },
    flowchart: {
      curve: 'linear',
      // 用 HTML 标签渲染节点文本，中文长标签可自动换行，避免文字堆叠/重叠。
      htmlLabels: true,
      nodeSpacing: Math.round(42 * spacing),
      rankSpacing: Math.round(54 * spacing),
      useMaxWidth: false
    },
    sequence: {
      useMaxWidth: false,
      actorMargin: 64,
      messageMargin: 42,
      diagramMarginX: 24,
      diagramMarginY: 24
    }
  }
}

async function renderMermaid(
  source: string,
  theme: DiagramTheme,
  id: string
): Promise<{ svg: string; width: number }> {
  return enqueueMermaidRender(async () => {
    const { createMermaidPlugin } = await import('@streamdown/mermaid')
    const plugin = createMermaidPlugin({
      config: mermaidConfig(theme, adaptiveFontSize(source))
    })
    try {
      const result = await plugin.getMermaid().render(id, source)
      const svg = expandSvgViewBox(ensureMermaidLabelVisibility(result.svg))
      return { svg, width: diagramWidthFromSvg(svg) }
    } catch (originalError) {
      // 原语法渲染失败：尝试轻量修复常见错误（方向行、subgraph 中文标签）。
      const repaired = repairMermaidSource(source)
      if (repaired !== source) {
        const result = await plugin.getMermaid().render(`${id}-r`, repaired)
        const svg = expandSvgViewBox(ensureMermaidLabelVisibility(result.svg))
        return { svg, width: diagramWidthFromSvg(svg) }
      }
      throw originalError
    }
  })
}

function downloadSvg(svg: string): void {
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'legalwork-flowchart.svg'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function IconButton({
  title,
  onClick,
  children,
  disabled = false
}: {
  title: string
  onClick: () => void
  children: ReactElement
  disabled?: boolean
}): ReactElement {
  return (
    <button
      type="button"
      className="ds-mermaid-action"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function DiagramViewport({
  svg,
  width,
  fullscreen = false
}: {
  svg: string
  width: number
  fullscreen?: boolean
}): ReactElement {
  const { t } = useTranslation()
  const [zoom, setZoom] = useState(1)
  const scaledWidth = Math.round(width * zoom)

  const changeZoom = (delta: number): void => {
    setZoom((value) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, value + delta)))
  }

  return (
    <div
      className={`ds-mermaid-viewport${fullscreen ? ' is-fullscreen' : ''}`}
      data-streamdown="mermaid"
    >
      <div className="ds-mermaid-zoom-controls" aria-label={t('mermaidZoomControls')}>
        <IconButton
          title={t('mermaidZoomOut')}
          disabled={zoom <= MIN_ZOOM}
          onClick={() => changeZoom(-ZOOM_STEP)}
        >
          <Minus className="h-3.5 w-3.5" strokeWidth={2} />
        </IconButton>
        <span className="ds-mermaid-zoom-value">{Math.round(zoom * 100)}%</span>
        <IconButton
          title={t('mermaidZoomIn')}
          disabled={zoom >= MAX_ZOOM}
          onClick={() => changeZoom(ZOOM_STEP)}
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
        </IconButton>
        <IconButton title={t('mermaidZoomReset')} onClick={() => setZoom(1)}>
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.9} />
        </IconButton>
      </div>
      <div className="ds-mermaid-scroll">
        <div
          className="ds-mermaid-canvas"
          style={{ width: `${scaledWidth}px` }}
          role="img"
          aria-label={t('mermaidDiagramLabel')}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
    </div>
  )
}

export function MermaidDiagram({
  code,
  isIncomplete = false
}: {
  code: string
  isIncomplete?: boolean
}): ReactElement {
  const { t } = useTranslation()
  const source = useMemo(() => code.replace(/\n+$/, ''), [code])
  const theme = useDiagramTheme()
  const reactId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const renderAttemptRef = useRef(0)
  const [retryKey, setRetryKey] = useState(0)
  const [renderState, setRenderState] = useState<RenderState>({ status: 'idle' })
  const lastReadyRef = useRef<LastReadyDiagram | null>(null)
  const [copied, setCopied] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const copyResetRef = useRef<number | null>(null)

  // A cached result maps 1:1 to its source+theme, so a stored last-ready only
  // stays reusable while the current source+theme match it.
  const lastReadyMatches = lastReadyRef.current !== null
    && lastReadyRef.current.source === source
    && lastReadyRef.current.theme === theme
  const shownReady: MermaidRenderResult | null = renderState.status === 'ready'
    ? renderState
    : (lastReadyMatches ? lastReadyRef.current : null)

  useEffect(() => {
    if (isIncomplete || !source.trim()) {
      setRenderState({ status: 'idle' })
      return
    }

    const cacheKey = mermaidCacheKey(source, theme)
    const cached = mermaidSvgCache.get(cacheKey)
    if (cached) {
      lastReadyRef.current = { source, theme, ...cached }
      setRenderState({ status: 'ready', ...cached })
      return
    }

    let cancelled = false
    const attempt = ++renderAttemptRef.current
    setRenderState({ status: 'loading' })

    void renderMermaid(source, theme, `legalwork-mermaid-${reactId}-${attempt}`).then(
      (result) => {
        if (cancelled) return
        mermaidSvgCache.set(cacheKey, result)
        if (mermaidSvgCache.size > MERMAID_SVG_CACHE_MAX) {
          const oldestKey = mermaidSvgCache.keys().next().value
          if (oldestKey !== undefined) mermaidSvgCache.delete(oldestKey)
        }
        lastReadyRef.current = { source, theme, ...result }
        setRenderState({ status: 'ready', ...result })
      },
      (error: unknown) => {
        if (cancelled) return
        const message = error instanceof Error ? error.message : '无法解析这张流程图'
        setRenderState({ status: 'error', message })
      }
    )

    return () => {
      cancelled = true
    }
  }, [isIncomplete, reactId, retryKey, source, theme])

  useEffect(() => {
    if (!fullscreen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setFullscreen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [fullscreen])

  useEffect(
    () => () => {
      if (copyResetRef.current !== null) window.clearTimeout(copyResetRef.current)
    },
    []
  )

  const handleCopy = async (): Promise<void> => {
    if (!navigator.clipboard?.writeText) return
    try {
      await navigator.clipboard.writeText(source)
      setCopied(true)
      if (copyResetRef.current !== null) window.clearTimeout(copyResetRef.current)
      copyResetRef.current = window.setTimeout(() => setCopied(false), COPY_RESET_MS)
    } catch {
      setCopied(false)
    }
  }

  const ready = renderState.status === 'ready' ? renderState : null

  return (
    <div className="ds-mermaid-block" data-streamdown="mermaid-block">
      <div className="ds-mermaid-header">
        <div className="ds-mermaid-title">
          <span className="ds-mermaid-title-mark" aria-hidden="true" />
          <span>{t('mermaidTitle')}</span>
          <span className="ds-mermaid-format">Mermaid</span>
        </div>
        <div className="ds-mermaid-actions">
          <IconButton
            title={copied ? t('mermaidSourceCopied') : t('mermaidCopySource')}
            onClick={() => void handleCopy()}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" strokeWidth={2.1} />
            ) : (
              <Copy className="h-3.5 w-3.5" strokeWidth={1.9} />
            )}
          </IconButton>
          <IconButton
            title={t('mermaidDownloadSvg')}
            disabled={!ready}
            onClick={() => ready && downloadSvg(ready.svg)}
          >
            <Download className="h-3.5 w-3.5" strokeWidth={1.9} />
          </IconButton>
          <IconButton
            title={t('mermaidViewFullscreen')}
            disabled={!ready}
            onClick={() => ready && setFullscreen(true)}
          >
            <Maximize2 className="h-3.5 w-3.5" strokeWidth={1.9} />
          </IconButton>
        </div>
      </div>

      {isIncomplete ? (
        <div className="ds-mermaid-status">{t('mermaidReceiving')}</div>
      ) : shownReady ? (
        // shownReady is either the freshly rendered result or, while a
        // re-render is in flight for the same source+theme, the last rendered
        // diagram. Keeping the viewport mounted (instead of swapping to the
        // spinner) prevents the scroll/zoom state from resetting and avoids a
        // flash back to the loading state.
        <DiagramViewport svg={shownReady.svg} width={shownReady.width} />
      ) : renderState.status === 'error' ? (
        <div className="ds-mermaid-error" role="alert">
          <div>
            <strong>{t('mermaidRenderFailed')}</strong>
            <p>{renderState.message}</p>
          </div>
          <button type="button" onClick={() => setRetryKey((value) => value + 1)}>
            {t('mermaidRetry')}
          </button>
          <details>
            <summary>{t('mermaidViewSource')}</summary>
            <pre>{source}</pre>
          </details>
        </div>
      ) : (
        <div className="ds-mermaid-status">
          <span className="ds-mermaid-spinner" aria-hidden="true" />
          {t('mermaidRendering')}
        </div>
      )}

      {fullscreen && ready && typeof document !== 'undefined'
        ? createPortal(
            <div
              className="ds-mermaid-fullscreen"
              role="dialog"
              aria-modal="true"
              aria-label={t('mermaidFullscreenLabel')}
            >
              <div className="ds-mermaid-fullscreen-header">
                <span>{t('mermaidTitle')}</span>
                <IconButton title={t('mermaidExitFullscreen')} onClick={() => setFullscreen(false)}>
                  <X className="h-4 w-4" strokeWidth={1.9} />
                </IconButton>
              </div>
              <DiagramViewport svg={ready.svg} width={ready.width} fullscreen />
            </div>,
            document.body
          )
        : null}
    </div>
  )
}
