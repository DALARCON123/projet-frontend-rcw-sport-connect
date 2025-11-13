import { recoApi } from './apiClient'

export const getPersonalReco = async (payload) => {
  const { data } = await recoApi.post('/reco/personal', payload)
  return data
}
