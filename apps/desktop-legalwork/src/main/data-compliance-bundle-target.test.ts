import { describe, expect, it } from 'vitest'
import {
  complianceBundleUrl,
  complianceBundleRuntimeDirName,
  resolveComplianceBundleMachine
} from './data-compliance-bundle-target'

describe('data-compliance bundle target', () => {
  it('maps supported desktop architectures to COS machine names', () => {
    expect(resolveComplianceBundleMachine('win32', 'x64')).toBe('win-x64')
    expect(resolveComplianceBundleMachine('darwin', 'arm64')).toBe('mac-arm64')
    expect(resolveComplianceBundleMachine('darwin', 'x64')).toBe('mac-x64')
    expect(resolveComplianceBundleMachine('linux', 'x64')).toBe('linux-x64')
  })

  it('rejects unsupported targets instead of silently downloading the wrong bundle', () => {
    expect(() => resolveComplianceBundleMachine('darwin', 'ia32')).toThrow(/Unsupported/)
    expect(() => resolveComplianceBundleMachine('win32', 'arm64')).toThrow(/Unsupported/)
  })

  it('keeps the legacy Windows runtime directory while isolating Mac architectures', () => {
    expect(complianceBundleRuntimeDirName('0.3.30', 'win-x64')).toBe('runtime-v0.3.30')
    expect(complianceBundleRuntimeDirName('0.3.30', 'mac-arm64')).toBe('runtime-v0.3.30-mac-arm64')
    expect(complianceBundleRuntimeDirName('0.3.30', 'mac-x64')).toBe('runtime-v0.3.30-mac-x64')
  })

  it('builds the exact architecture-specific COS URL', () => {
    const base = 'https://legalwork-1318565101.cos.ap-guangzhou.myqcloud.com/'
    expect(complianceBundleUrl(base, '0.3.30', 'mac-arm64')).toBe(
      'https://legalwork-1318565101.cos.ap-guangzhou.myqcloud.com/legalwork/compliance/env/mac-arm64/legalwork-compliance-env-mac-arm64-v0.3.30.tar.gz'
    )
    expect(complianceBundleUrl(base, '0.3.30', 'mac-x64')).toBe(
      'https://legalwork-1318565101.cos.ap-guangzhou.myqcloud.com/legalwork/compliance/env/mac-x64/legalwork-compliance-env-mac-x64-v0.3.30.tar.gz'
    )
  })
})
