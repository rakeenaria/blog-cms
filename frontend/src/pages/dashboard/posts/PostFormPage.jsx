import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../../api/axios'
import DashboardLayout from '../../../components/layout/DashboardLayout'

export default function PostFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({ title: '', body: '', status: 'draft', categories: [] })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [existingImage, setExistingImage] = useState(null)
  const [categories, setCategories] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  useEffect(() => {
    api.get('/api/categories').then(({ data }) => setCategories(data)).catch(console.error)
    if (isEdit) {
      api.get(`/api/admin/posts/${id}`)
        .then(({ data }) => {
          setForm({ title: data.title, body: data.body, status: data.status, categories: data.categories?.map(c => c.id) || [] })
          if (data.featured_image) setExistingImage(`${import.meta.env.VITE_API_BASE_URL}/storage/${data.featured_image}`)
        })
        .catch(console.error)
        .finally(() => setFetching(false))
    }
  }, [id])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleCategoryToggle = (catId) => setForm(prev => ({
    ...prev,
    categories: prev.categories.includes(catId) ? prev.categories.filter(c => c !== catId) : [...prev.categories, catId],
  }))
  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('body', form.body)
      formData.append('status', form.status)
      form.categories.forEach(cid => formData.append('categories[]', cid))
      if (imageFile) formData.append('featured_image', imageFile)

      const config = { headers: { 'Content-Type': 'multipart/form-data' } }
      if (isEdit) await api.post(`/api/admin/posts/${id}`, formData, config)
      else await api.post('/api/admin/posts', formData, config)

      navigate('/dashboard/posts')
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) setErrors(data.errors)
      else setErrors({ title: [data?.message || 'Save failed.'] })
    } finally { setLoading(false) }
  }

  if (fetching) return (
    <DashboardLayout>
      <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div></div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout>
      <div className="p-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{isEdit ? 'Edit Post' : 'New Post'}</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 rounded-lg p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Post title" />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Body * <span className="text-gray-400 font-normal">(HTML supported)</span></label>
            <textarea name="body" value={form.body} onChange={handleChange} required rows={12}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              placeholder="Write your post content here…" />
            {errors.body && <p className="mt-1 text-xs text-red-600">{errors.body[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categories * (select at least one)</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button key={cat.id} type="button" onClick={() => handleCategoryToggle(cat.id)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    form.categories.includes(cat.id)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                  }`}>
                  {cat.name}
                </button>
              ))}
            </div>
            {errors.categories && <p className="mt-1 text-xs text-red-600">{errors.categories[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select name="status" value={form.status} onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImage} className="text-sm text-gray-600" />
            {errors.featured_image && <p className="mt-1 text-xs text-red-600">{errors.featured_image[0]}</p>}
            {(imagePreview || existingImage) && (
              <img src={imagePreview || existingImage} alt="Preview" className="mt-3 h-40 w-auto rounded-md object-cover border border-gray-200" />
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-60">
              {loading ? 'Saving…' : (isEdit ? 'Update Post' : 'Create Post')}
            </button>
            <button type="button" onClick={() => navigate('/dashboard/posts')}
              className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

