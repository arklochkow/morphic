import { afterEach, describe, expect, it, vi } from 'vitest'

import { getModel } from '@/lib/utils/registry'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('OpenAI compatible history', () => {
  it.each([
    ['http://localhost:11434/v1', false],
    ['https://api.openai.com/v1', true]
  ])('serializes assistant history for %s', async (baseURL, references) => {
    vi.stubEnv('OPENAI_BASE_URL', baseURL)
    vi.stubEnv('OPENAI_API_KEY', 'test-key')
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(
          JSON.stringify({ error: { message: 'stop after capture' } }),
          { status: 400, headers: { 'content-type': 'application/json' } }
        )
      )
    vi.stubGlobal('fetch', fetchMock)

    const model = getModel('openai:custom-model')
    await expect(
      model.doGenerate({
        prompt: [
          { role: 'user', content: [{ type: 'text', text: 'Hello' }] },
          {
            role: 'assistant',
            content: [
              {
                type: 'text',
                text: 'Hi',
                providerOptions: { openai: { itemId: 'msg_previous' } }
              }
            ]
          },
          { role: 'user', content: [{ type: 'text', text: 'Continue' }] }
        ]
      })
    ).rejects.toThrow()

    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(
      body.input.some(
        (item: { type: string }) => item.type === 'item_reference'
      )
    ).toBe(references)
    if (!references) {
      expect(body.store).toBe(false)
      expect(body.input).toContainEqual(
        expect.objectContaining({ role: 'assistant', content: 'Hi' })
      )
    }
  })
})
