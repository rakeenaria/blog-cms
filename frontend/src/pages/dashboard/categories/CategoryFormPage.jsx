import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../../api/axios'
import DashboardLayout from '../../../components/layout/DashboardLayout'

export default function CategoryFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState({ name: '', description: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEdit) {
      api.get(`/api/categories/${id}`)
        .then(({ data }) => setForm({ name: data.name, description: data.description || '' }))
        .catch(console.error)
    }
  }, [id])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      if (isEdit) await api.put(`/api/admin/categories/${id}`, form)
      else await api.post('/api/admin/categories', form)
      navigate('/dashboard/categories')
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) setErrors(data.errors)
      else setErrors({ name: [data?.message || 'Save failed.'] })
    } finally { setLoading(false) }
  }

  return (
    <DashboardLayout>
      <div className="p-8 max-w-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{isEdit ? 'Edit Category' : 'New Category'}</h1>
        <form onSubmit={handleSubmit} className="space-y-5 bg-white border border-gray-200 rounded-lg p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Category name" />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name[0]}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Optional description" />
            {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description[0]}</p>}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-60">
              {loading ? 'Saving…' : (isEdit ? 'Update' : 'Create')}
            </button>
            <button type="button" onClick={() => navigate('/dashboard/categories')}
              className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

