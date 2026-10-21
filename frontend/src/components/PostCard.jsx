import { Link } from 'react-router-dom'

export default function PostCard({ post }) {
  const imageUrl = post.featured_image
    ? `${import.meta.env.VITE_API_BASE_URL}/storage/${post.featured_image}`
    : null

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    })
  }

  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {imageUrl ? (
        <img src={imageUrl} alt={post.title} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
          <span className="text-blue-300 text-4xl">📝</span>
        </div>
      )}
      <div className="p-5">
        <div className="flex flex-wrap gap-1 mb-2">
          {post.categories?.map((cat) => (
            <span key={cat.id} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
              {cat.name}
            </span>
          ))}
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
          <Link to={`/posts/${post.slug}`} className="hover:text-blue-600">{post.title}</Link>
        </h2>
        <p className="text-sm text-gray-500">
          By {post.user?.name} · {formatDate(post.published_at)}
        </p>
      </div>
    </article>
  )
}

