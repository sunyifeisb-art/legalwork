export function resolveComplianceBundleMachine(
  platform: NodeJS.Platform = process.platform,
  arch: NodeJS.Architecture = process.arch
): string {
  if (platform === 'win32' && arch === 'x64') return 'win-x64'
  if (platform === 'darwin' && arch === 'arm64') return 'mac-arm64'
  if (platform === 'darwin' && arch === 'x64') return 'mac-x64'
  if (platform === 'linux' && arch === 'x64') return 'linux-x64'
  throw new Error(`Unsupported data-compliance bundle target: ${platform}-${arch}`)
}

export function complianceBundleRuntimeDirName(version: string, machine: string): string {
  // Preserve the existing Windows location so current Windows users do not re-download
  // the 0.3.30 bundle merely because Mac architecture support was added later.
  if (machine === 'win-x64') return `runtime-v${version}`
  return `runtime-v${version}-${machine}`
}

export function complianceBundleUrl(baseUrl: string, version: string, machine: string): string {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '')
  return `${normalizedBaseUrl}/legalwork/compliance/env/${machine}/legalwork-compliance-env-${machine}-v${version}.tar.gz`
}
