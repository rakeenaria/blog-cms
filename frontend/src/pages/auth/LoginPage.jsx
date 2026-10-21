import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) setErrors(data.errors)
      else setErrors({ email: [data?.message || 'Login failed. Please try again.'] })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">Jejak Aksara</Link>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Sign in to your account</h2>
        </div>
        <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-8 space-y-5 border border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com" />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email[0]}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••" />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password[0]}</p>}
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-60">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

