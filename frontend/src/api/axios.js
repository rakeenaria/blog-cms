import axios from 'axios'

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? 'http://localhost:8000' : '')

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Required for Sanctum session cookies
  withXSRFToken: true,   // Forces Axios to attach X-XSRF-TOKEN on cross-origin requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

// Attach XSRF-TOKEN cookie and Sanctum Bearer token (for production deployments)
api.interceptors.request.use((config) => {
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^|;\\s*)XSRF-TOKEN=([^;]*)'))
    if (match && match[2]) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(match[2])
    }
  }
  if (typeof sessionStorage !== 'undefined') {
    const token = sessionStorage.getItem('auth_token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
  }
  return config
})

export default api
