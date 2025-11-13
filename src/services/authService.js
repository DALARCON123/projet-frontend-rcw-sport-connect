import { authApi } from './apiClient'

export const login = async (email, password) => {
  const { data } = await authApi.post('/auth/login', { email, password })
  localStorage.setItem('token', data.access_token)
  return data
}

export const register = async (name, email, password) => {
  const { data } = await authApi.post('/auth/register', { name, email, password })
  return data
}
