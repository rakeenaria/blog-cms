import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      await api.post('/api/register', form)
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) setErrors(data.errors)
      else setErrors({ name: [data?.message || 'Registration failed.'] })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">Jejak Aksara</Link>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Create an account</h2>
          <p className="text-sm text-gray-500 mt-1">You will be registered as an Author</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-8 space-y-5 border border-gray-200">
          {[
            { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Jane Doe' },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
            { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
            { name: 'password_confirmation', label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
          ].map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input type={type} name={name} value={form[name]} onChange={handleChange} required
                placeholder={placeholder}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name][0]}</p>}
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-60">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

