import { describe, expect, it } from 'vitest'
import {
  buildPlanRelativePath,
  isGuiPlanRelativePath,
  nextAvailablePlanRelativePath,
  planFeatureNameFromRequest
} from './plan-path'

describe('plan-path', () => {
  it('keeps readable Chinese feature names', () => {
    expect(planFeatureNameFromRequest('做一个登录页')).toBe('做一个登录页')
    expect(buildPlanRelativePath('做一个登录页')).toBe('.legalworksdd/plan/做一个登录页.md')
  })

  it('normalizes English spacing and illegal filename characters', () => {
    expect(planFeatureNameFromRequest('Build Login: OAuth / SSO?')).toBe('build-login-oauth-sso')
  })

  it('falls back for empty or unsafe names', () => {
    expect(planFeatureNameFromRequest('../')).toBe('plan')
    expect(buildPlanRelativePath('../')).toBe('.legalworksdd/plan/plan.md')
  })

  it('selects the next available duplicate path', () => {
    expect(
      nextAvailablePlanRelativePath('login', [
        '.legalworksdd/plan/login.md',
        '.legalworksdd/plan/login-2.md'
      ])
    ).toBe('.legalworksdd/plan/login-3.md')
  })

  it('accepts only direct markdown files inside the GUI plan directory', () => {
    expect(isGuiPlanRelativePath('.legalworksdd/plan/login.md')).toBe(true)
    expect(isGuiPlanRelativePath('.deepseekgui/plan/login.md')).toBe(true)
    expect(isGuiPlanRelativePath('.legalworksdd/plan/nested/login.md')).toBe(false)
    expect(isGuiPlanRelativePath('../.legalworksdd/plan/login.md')).toBe(false)
    expect(isGuiPlanRelativePath('.legalworksdd/plan/login.txt')).toBe(false)
  })
})
