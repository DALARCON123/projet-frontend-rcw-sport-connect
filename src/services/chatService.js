import { chatApi } from './apiClient'

export const askBot = async (question, lang='fr') => {
  const { data } = await chatApi.post('/chat/ask', { question, lang })
  return data
}
