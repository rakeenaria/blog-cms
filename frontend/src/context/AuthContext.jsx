import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount, restore auth state from session cookie or token
  const fetchUser = useCallback(async () => {
    try {
      const { data } = await api.get('/api/user')
      setUser(data)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const login = async (email, password) => {
    // Step 1: Get CSRF cookie
    await api.get('/sanctum/csrf-cookie')
    // Step 2: Authenticate
    const { data } = await api.post('/api/login', { email, password })
    if (data.token) {
      sessionStorage.setItem('auth_token', data.token)
    }
    setUser(data.user)
    return data.user
  }

  const logout = async () => {
    try {
      await api.post('/api/logout')
    } finally {
      sessionStorage.removeItem('auth_token')
      setUser(null)
    }
  }

  const isAdmin = () => user?.role === 'admin'
  const isAuthor = () => user?.role === 'author'

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isAuthor, fetchUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
