import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../../api/axios'
import Navbar from '../../components/layout/Navbar'
import PostCard from '../../components/PostCard'

export default function HomePage() {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const page = searchParams.get('page') || '1'

  useEffect(() => { fetchCategories() }, [])
  useEffect(() => { fetchPosts() }, [search, category, page])

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/api/categories')
      setCategories(data)
    } catch (err) { console.error(err) }
  }

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = { page }
      if (search) params.search = search
      if (category) params.category = category
      const { data } = await api.get('/api/posts', { params })
      setPosts(data.data)
      setMeta(data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const q = new FormData(e.target).get('search')
    setSearchParams(q ? { search: q } : {})
  }

  const handleCategoryFilter = (slug) => {
    if (slug === category) setSearchParams(search ? { search } : {})
    else setSearchParams(search ? { search, category: slug } : { category: slug })
  }

  const handlePage = (url) => {
    if (!url) return
    const p = new URL(url).searchParams.get('page')
    setSearchParams((prev) => { prev.set('page', p); return prev })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="bg-white border-b border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Latest Articles</h1>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
            <input
              type="text" name="search" defaultValue={search}
              placeholder="Search articles…"
              className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <aside className="w-48 flex-shrink-0">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Categories</h2>
            <ul className="space-y-1">
              <li>
                <button onClick={() => handleCategoryFilter('')}
                  className={`text-sm w-full text-left px-2 py-1 rounded ${!category ? 'text-blue-700 font-medium' : 'text-gray-600 hover:text-blue-600'}`}>
                  All
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button onClick={() => handleCategoryFilter(cat.slug)}
                    className={`text-sm w-full text-left px-2 py-1 rounded ${category === cat.slug ? 'text-blue-700 font-medium' : 'text-gray-600 hover:text-blue-600'}`}>
                    {cat.name} <span className="text-gray-400">({cat.posts_count ?? 0})</span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 text-gray-500">No articles found.</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post) => <PostCard key={post.id} post={post} />)}
                </div>
                {meta && (meta.prev_page_url || meta.next_page_url) && (
                  <div className="flex justify-center gap-4 mt-8">
                    <button onClick={() => handlePage(meta.prev_page_url)} disabled={!meta.prev_page_url}
                      className="px-4 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-50">
                      ← Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-600">
                      Page {meta.current_page} of {meta.last_page}
                    </span>
                    <button onClick={() => handlePage(meta.next_page_url)} disabled={!meta.next_page_url}
                      className="px-4 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-50">
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

