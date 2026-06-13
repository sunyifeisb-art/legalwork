import { describe, expect, it } from 'vitest';

import { normalizeSettings } from '../src/storage/settings';

describe('normalizeSettings', () => {
  it('fills defaults when settings are missing', () => {
    expect(normalizeSettings({})).toEqual({
      aiEnabled: false,
      deepseekApiKey: '',
      deepseekBaseUrl: 'https://api.deepseek.com',
      deepseekModel: 'deepseek-chat'
    });
  });

  it('preserves user provided values', () => {
    expect(
      normalizeSettings({
        aiEnabled: true,
        deepseekApiKey: 'sk-test',
        deepseekModel: 'deepseek-reasoner'
      })
    ).toEqual({
      aiEnabled: true,
      deepseekApiKey: 'sk-test',
      deepseekBaseUrl: 'https://api.deepseek.com',
      deepseekModel: 'deepseek-reasoner'
    });
  });
});
