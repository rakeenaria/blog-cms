import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import DOMPurify from 'dompurify'
import api from '../../api/axios'
import Navbar from '../../components/layout/Navbar'

export default function ArticleDetailPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get(`/api/posts/${slug}`)
      .then(({ data }) => setPost(data))
      .catch((err) => setError(err.response?.status === 404 ? 'Article not found.' : 'Failed to load article.'))
      .finally(() => setLoading(false))
  }, [slug])

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''

  if (loading) return (
    <div className="min-h-screen bg-gray-50"><Navbar />
      <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div></div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-gray-50"><Navbar />
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 text-lg">{error}</p>
        <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">← Back to Home</Link>
      </div>
    </div>
  )

  const imageUrl = post.featured_image
    ? `${import.meta.env.VITE_API_BASE_URL}/storage/${post.featured_image}`
    : null
  const safeBody = DOMPurify.sanitize(post.body)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.categories?.map((cat) => (
            <Link key={cat.id} to={`/?category=${cat.slug}`}
              className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-100">
              {cat.name}
            </Link>
          ))}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-6">
          By <span className="font-medium text-gray-700">{post.user?.name}</span> · {formatDate(post.published_at)}
        </p>
        {imageUrl && <img src={imageUrl} alt={post.title} className="w-full rounded-lg mb-8 object-cover max-h-96" />}
        <div className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: safeBody }} />
        <div className="mt-10 pt-6 border-t border-gray-200">
          <Link to="/" className="text-blue-600 hover:underline text-sm">← Back to all articles</Link>
        </div>
      </article>
    </div>
  )
}

