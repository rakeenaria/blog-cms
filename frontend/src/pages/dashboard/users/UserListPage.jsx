import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../../api/axios'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import { useAuth } from '../../../context/AuthContext'

export default function UserListPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => { fetchUsers() }, [page])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/api/admin/users', { params: { page } })
      setUsers(data.data)
      setMeta(data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (id === currentUser?.id) { alert('You cannot delete your own account.'); return }
    if (!confirm('Delete this user? Their posts will also be deleted.')) return
    try {
      await api.delete(`/api/admin/users/${id}`)
      fetchUsers()
    } catch (err) { alert(err.response?.data?.message || 'Delete failed.') }
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <Link to="/dashboard/users/create" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
            + New User
          </Link>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? <div className="p-8 text-center text-gray-400">Loading…</div>
          : users.length === 0 ? <div className="p-8 text-center text-gray-400">No users found.</div>
          : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posts</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {u.name}
                      {u.id === currentUser?.id && <span className="ml-2 text-xs text-gray-400">(you)</span>}
                    </td>
                    <td className="px-6 py-3 text-gray-500">{u.email}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                        u.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>{u.role}</span>
                    </td>
                    <td className="px-6 py-3 text-gray-500">{u.posts_count ?? 0}</td>
                    <td className="px-6 py-3 text-right space-x-3">
                      <Link to={`/dashboard/users/${u.id}/edit`} className="text-blue-600 hover:underline text-xs">Edit</Link>
                      <button onClick={() => handleDelete(u.id)} disabled={u.id === currentUser?.id}
                        className="text-red-600 hover:underline text-xs disabled:opacity-30">Delete</button>
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

