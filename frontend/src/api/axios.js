import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  withCredentials: true, // Required for Sanctum session cookies
  withXSRFToken: true,   // Forces Axios to attach X-XSRF-TOKEN on cross-origin requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

// Double guarantee: if XSRF-TOKEN exists in document.cookie, attach it explicitly
api.interceptors.request.use((config) => {
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^|;\\s*)XSRF-TOKEN=([^;]*)'))
    if (match && match[2]) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(match[2])
    }
  }
  return config
})

export default api
