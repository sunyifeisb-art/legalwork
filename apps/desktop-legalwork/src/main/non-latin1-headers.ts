/**
 * Electron 主进程的网络层把响应头当 Latin-1 处理：只要某个响应头的值里出现中文
 * （或任何码位大于 255 的字符），fetch 在构造 Response 时就会抛
 * "Cannot convert argument to a ByteString…"。抛出点在 Electron 内部的回调里，
 * 逃出 Promise 链，业务侧的 try/catch 接不住，最终落到全局 uncaughtException。
 *
 * 腾讯 IMA 网关正是这样回错误的（trpc-error-msg: 登录失败，请重新登录），于是
 * "IMA 登录过期"会把整个应用打崩。本模块负责两件事：
 *
 *   1. installNonLatin1ResponseHeaderGuard —— 在 session 层摘掉这类响应头，
 *      请求照常完成，业务代码仍然能从响应体里读到同样的 code / msg；
 *   2. isNonLatin1ResponseHeaderError —— 全局兜底，识别这一类异常，让它按
 *      "某次请求失败"处理，而不是按未知异常退出应用。
 */

import type { Session } from 'electron'
import { logWarn } from './logger'

/** undici（主进程 fetch 的底层实现）遇到非 Latin-1 响应头时的固定报错前缀。 */
const BYTE_STRING_ERROR_PREFIX = 'Cannot convert argument to a ByteString'

/** Latin-1 之外（码位大于 255）的字符正是 Electron 网络层无法接受的响应头内容。 */
function hasNonLatin1Char(value: string): boolean {
  for (let index = 0; index < value.length; index += 1) {
    if (value.charCodeAt(index) > 255) return true
  }
  return false
}

/** 摘掉值里含非 Latin-1 字符的响应头，返回保留的头和被摘掉的头名。 */
export function stripNonLatin1ResponseHeaders(
  headers: Record<string, string | string[]>
): { headers: Record<string, string | string[]>; dropped: string[] } {
  const kept: Record<string, string | string[]> = {}
  const dropped: string[] = []
  for (const name of Object.keys(headers)) {
    const value = headers[name]
    const values = Array.isArray(value) ? value : [value]
    if (values.some((item) => typeof item === 'string' && hasNonLatin1Char(item))) {
      dropped.push(name)
      continue
    }
    kept[name] = value
  }
  return { headers: kept, dropped }
}

/** 让指定 session 的请求不会再因为非 Latin-1 响应头而抛异常。 */
export function installNonLatin1ResponseHeaderGuard(target: Session, urls: string[]): void {
  target.webRequest.onHeadersReceived({ urls }, (details, callback) => {
    const { headers, dropped } = stripNonLatin1ResponseHeaders(details.responseHeaders ?? {})
    if (dropped.length > 0) {
      logWarn('non-latin1-response-header', `已忽略非 Latin-1 响应头：${dropped.join('、')}`, {
        url: details.url
      })
    }
    callback({ responseHeaders: headers })
  })
}

/**
 * 判断异常是否属于"响应头非 Latin-1"这一类。这类异常只代表那一次请求失败，
 * 应用状态仍然完好，不应该被当作致命错误处理。
 */
export function isNonLatin1ResponseHeaderError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? '')
  return message.startsWith(BYTE_STRING_ERROR_PREFIX)
}
