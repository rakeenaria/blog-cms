import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../../api/axios'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import { useAuth } from '../../../context/AuthContext'

export default function PostListPage() {
  const { isAdmin } = useAuth()
  const [posts, setPosts] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => { fetchPosts() }, [page])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/api/admin/posts', { params: { page } })
      setPosts(data.data)
      setMeta(data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return
    try {
      await api.delete(`/api/admin/posts/${id}`)
      fetchPosts()
    } catch (err) { alert(err.response?.data?.message || 'Delete failed.') }
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
          <Link to="/dashboard/posts/create" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
            + New Post
          </Link>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? <div className="p-8 text-center text-gray-400">Loading…</div>
          : posts.length === 0 ? <div className="p-8 text-center text-gray-400">No posts yet.</div>
          : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  {isAdmin() && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categories</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900 max-w-xs truncate">{post.title}</td>
                    {isAdmin() && <td className="px-6 py-3 text-gray-500">{post.user?.name}</td>}
                    <td className="px-6 py-3">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                        post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>{post.status}</span>
                    </td>
                    <td className="px-6 py-3 text-gray-500 max-w-xs truncate">
                      {post.categories?.map(c => c.name).join(', ')}
                    </td>
                    <td className="px-6 py-3 text-gray-500">{new Date(post.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-3 text-right space-x-3">
                      <Link to={`/dashboard/posts/${post.id}/edit`} className="text-blue-600 hover:underline text-xs">Edit</Link>
                      <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:underline text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {meta && (meta.prev_page_url || meta.next_page_url) && (
          <div className="flex justify-center gap-4 mt-6">
            <button onClick={() => setPage(p => p - 1)} disabled={!meta.prev_page_url}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-50">← Previous</button>
            <span className="px-4 py-2 text-sm text-gray-600">Page {meta.current_page} of {meta.last_page}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={!meta.next_page_url}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-50">Next →</button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

