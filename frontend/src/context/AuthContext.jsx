import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount, restore auth state from session cookie
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
    // Step 2: Authenticate (XSRF-TOKEN sent automatically by Axios)
    const { data } = await api.post('/login', { email, password })
    setUser(data.user)
    return data.user
  }

  const logout = async () => {
    await api.post('/logout')
    setUser(null)
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

