import axios from 'axios'

const authBase = import.meta.env.VITE_AUTH_URL
const sportsBase = import.meta.env.VITE_SPORTS_URL
const recoBase = import.meta.env.VITE_RECO_URL
const chatBase = import.meta.env.VITE_CHAT_URL

const getToken = () => localStorage.getItem('token') || ''

export const authApi = axios.create({ baseURL: authBase })
export const sportsApi = axios.create({ baseURL: sportsBase })
export const recoApi = axios.create({ baseURL: recoBase })
export const chatApi = axios.create({ baseURL: chatBase })

const attachAuth = (instance: any) => {
  instance.interceptors.request.use((config: any) => {
    const token = getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })
}

[authApi, sportsApi, recoApi, chatApi].forEach(attachAuth)
