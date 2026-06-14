import { describe, expect, it } from 'vitest'
import { parseServeOptions } from './serve.js'

describe('serve option parsing', () => {
  it('parses endpoint format from CLI arguments', () => {
    const options = parseServeOptions([
      '--data-dir',
      '/tmp/legalwork',
      '--endpoint-format',
      'chat_completions'
    ])

    expect(options.endpointFormat).toBe('chat_completions')
  })

  it('parses endpoint format from the environment', () => {
    const options = parseServeOptions(['--data-dir', '/tmp/legalwork'], {
      LEGALWORK_ENDPOINT_FORMAT: 'messages'
    })

    expect(options.endpointFormat).toBe('messages')
  })
})
