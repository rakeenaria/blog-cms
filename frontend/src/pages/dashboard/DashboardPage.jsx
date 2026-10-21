import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAuth } from '../../context/AuthContext'

export default function DashboardPage() {
  const { user, isAdmin } = useAuth()
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0 })
  const [recentPosts, setRecentPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/admin/posts', { params: { page: 1 } })
      .then(({ data }) => {
        setRecentPosts(data.data.slice(0, 5))
        setStats({
          total: data.total,
          published: data.data.filter(p => p.status === 'published').length,
          draft: data.data.filter(p => p.status === 'draft').length,
        })
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-500 text-sm mt-1">Here&apos;s an overview of your content.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Posts', value: stats.total, color: 'text-blue-700' },
            { label: 'Published', value: stats.published, color: 'text-green-700' },
            { label: 'Drafts', value: stats.draft, color: 'text-yellow-700' },
          ].map((card) => (
            <div key={card.label} className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className={`text-3xl font-bold mt-1 ${card.color}`}>{loading ? '—' : card.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mb-8">
          <Link to="/dashboard/posts/create" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
            + New Post
          </Link>
          {isAdmin() && (
            <Link to="/dashboard/categories/create" className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50">
              + New Category
            </Link>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Recent Posts</h2>
            <Link to="/dashboard/posts" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading…</div>
          ) : recentPosts.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No posts yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">{post.title}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                        post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>{post.status}</span>
                    </td>
                    <td className="px-6 py-3 text-gray-500">{new Date(post.created_at).toLocaleDateString()}</td>
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

