import { Model } from '@/lib/types/models'

export const DEFAULT_MODEL: Model = {
  id: process.env.OPENAI_MODEL?.trim() || 'gpt-5.4-mini',
  name: process.env.OPENAI_MODEL?.trim() || 'GPT-5.4 mini',
  provider: 'OpenAI',
  providerId: 'openai'
}
