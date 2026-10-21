import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../../api/axios'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import { useAuth } from '../../../context/AuthContext'

export default function CategoryListPage() {
  const { isAdmin } = useAuth()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchCategories() }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/api/categories')
      setCategories(data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return
    try {
      await api.delete(`/api/admin/categories/${id}`)
      fetchCategories()
    } catch (err) { alert(err.response?.data?.message || 'Delete failed.') }
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          {isAdmin() && (
            <Link to="/dashboard/categories/create" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
              + New Category
            </Link>
          )}
        </div>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? <div className="p-8 text-center text-gray-400">Loading…</div>
          : categories.length === 0 ? <div className="p-8 text-center text-gray-400">No categories yet.</div>
          : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posts</th>
                  {isAdmin() && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">{cat.name}</td>
                    <td className="px-6 py-3 text-gray-500 font-mono text-xs">{cat.slug}</td>
                    <td className="px-6 py-3 text-gray-500">{cat.posts_count ?? 0}</td>
                    {isAdmin() && (
                      <td className="px-6 py-3 text-right space-x-3">
                        <Link to={`/dashboard/categories/${cat.id}/edit`} className="text-blue-600 hover:underline text-xs">Edit</Link>
                        <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:underline text-xs">Delete</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

