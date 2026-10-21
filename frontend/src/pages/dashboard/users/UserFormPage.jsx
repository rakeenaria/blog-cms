import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../../api/axios'
import DashboardLayout from '../../../components/layout/DashboardLayout'

export default function UserFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '', role: 'author' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEdit) {
      api.get(`/api/admin/users/${id}`)
        .then(({ data }) => setForm(f => ({ ...f, name: data.name, email: data.email, role: data.role })))
        .catch(console.error)
    }
  }, [id])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      const payload = { ...form }
      if (isEdit && !payload.password) { delete payload.password; delete payload.password_confirmation }
      if (isEdit) await api.put(`/api/admin/users/${id}`, payload)
      else await api.post('/api/admin/users', payload)
      navigate('/dashboard/users')
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) setErrors(data.errors)
      else setErrors({ name: [data?.message || 'Save failed.'] })
    } finally { setLoading(false) }
  }

  return (
    <DashboardLayout>
      <div className="p-8 max-w-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{isEdit ? 'Edit User' : 'New User'}</h1>
        <form onSubmit={handleSubmit} className="space-y-5 bg-white border border-gray-200 rounded-lg p-6">
          {[{ name: 'name', label: 'Full Name', type: 'text' }, { name: 'email', label: 'Email', type: 'email' }].map(({ name, label, type }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label} *</label>
              <input type={type} name={name} value={form[name]} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name][0]}</p>}
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password {isEdit ? <span className="text-gray-400 font-normal">(leave blank to keep)</span> : '*'}
            </label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required={!isEdit}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password[0]}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password {!isEdit && '*'}</label>
            <input type="password" name="password_confirmation" value={form.password_confirmation} onChange={handleChange} required={!isEdit}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
            <select name="role" value={form.role} onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option value="author">Author</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role[0]}</p>}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-60">
              {loading ? 'Saving…' : (isEdit ? 'Update User' : 'Create User')}
            </button>
            <button type="button" onClick={() => navigate('/dashboard/users')}
              className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

