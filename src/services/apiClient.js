import axios from 'axios'

const authBase = import.meta.env.VITE_AUTH_URL
const sportsBase = import.meta.env.VITE_SPORTS_URL
const recoBase = import.meta.env.VITE_RECO_URL
const chatBase = import.meta.env.VITE_CHAT_URL

// opcional: token guardado en localStorage
const getToken = () => localStorage.getItem('token') || ''

export const authApi = axios.create({ baseURL: authBase })
export const sportsApi = axios.create({ baseURL: sportsBase })
export const recoApi = axios.create({ baseURL: recoBase })
export const chatApi = axios.create({ baseURL: chatBase })

// Interceptor para JWT
const attachAuth = (instance) => {
  instance.interceptors.request.use(cfg => {
    const token = getToken()
    if (token) cfg.headers.Authorization = `Bearer ${token}`
    return cfg
  })
}
[authApi, sportsApi, recoApi, chatApi].forEach(attachAuth)
