/**
 * MCP 服务器降噪策略（UI 层共享）。
 *
 * - LENIENT：不常用且依赖海外网络的服务（context7 云 API、playwright CDN），
 *   连接失败也一律显示为"已连接"，不报错、不计错误。
 * - NETWORK_DEPENDENT：打海外 API 的服务（github），网络类失败只在对应项显示
 *   "需要网络环境"，不整体报错、不顶栏报错；鉴权类错误仍正常报错。
 */

export const LENIENT_MCP_SERVER_IDS = ['context7', 'playwright']

// 需要外网才能起来的服务。绝大多数用户用不到它们，连不上时只在该项显示
// "需要网络环境"，绝不标红、不计入错误数。
export const NETWORK_DEPENDENT_MCP_SERVER_IDS = ['github', 'flint-chart']

export function isLenientMcpServer(id: string): boolean {
  return LENIENT_MCP_SERVER_IDS.includes(id)
}

export function isNetworkDependentMcpServer(id: string): boolean {
  return NETWORK_DEPENDENT_MCP_SERVER_IDS.includes(id)
}

/**
 * 是否为网络类错误（超时 / DNS / 连接被拒 / 连接中断等）。
 *
 * 匹配要求宽松：宁可多识别为网络问题，也不要把"没挂梯子"误报成红色故障。
 * `-32000 Connection closed` 是 stdio/npx 类服务在无外网时的典型表现（进程起来
 * 又立刻断），早期正则只认 -32001 超时，导致 github 这类服务照旧标红。
 */
export function isNetworkError(text: string): boolean {
  const normalized = text.trim()
  if (!normalized) return false
  return /timeout|timed out|-3200[01]|ECONNREFUSED|ECONNRESET|ENOTFOUND|EHOSTUNREACH|ETIMEDOUT|EPIPE|socket hang up|fetch failed|getaddrinfo|network|connection closed|connection reset|premature close|transport closed|not connected/i.test(
    normalized
  )
}

export type McpServerDiagnosticInput = {
  status: string
  lastError: string
  enabled: boolean
}

export type McpServerDisplayPolicy = {
  status: string
  lastError: string
  requiresNetwork: boolean
}

/**
 * 把一个 MCP 服务器的原始诊断状态归一化为"展示状态"：
 * - lenient 且启用 → 强制 connected、清空错误；
 * - 网络依赖服务且为网络错误 → 清空错误、标记 requiresNetwork（鉴权类错误保留原样）；
 * - 其他 → 原样返回。
 */
export function normalizeMcpServerDiagnostic(
  id: string,
  diagnostic: McpServerDiagnosticInput
): McpServerDisplayPolicy {
  const status = diagnostic.status.trim()
  const lastError = diagnostic.lastError.trim()
  if (isLenientMcpServer(id) && diagnostic.enabled) {
    return { status: 'connected', lastError: '', requiresNetwork: false }
  }
  if (isNetworkDependentMcpServer(id) && isNetworkError(lastError)) {
    return { status, lastError: '', requiresNetwork: true }
  }
  return { status, lastError, requiresNetwork: false }
}
