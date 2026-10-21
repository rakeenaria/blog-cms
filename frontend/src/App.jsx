import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import HomePage from './pages/public/HomePage'
import ArticleDetailPage from './pages/public/ArticleDetailPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import PostListPage from './pages/dashboard/posts/PostListPage'
import PostFormPage from './pages/dashboard/posts/PostFormPage'
import CategoryListPage from './pages/dashboard/categories/CategoryListPage'
import CategoryFormPage from './pages/dashboard/categories/CategoryFormPage'
import UserListPage from './pages/dashboard/users/UserListPage'
import UserFormPage from './pages/dashboard/users/UserFormPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts/:slug" element={<ArticleDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/dashboard/posts" element={<ProtectedRoute><PostListPage /></ProtectedRoute>} />
          <Route path="/dashboard/posts/create" element={<ProtectedRoute><PostFormPage /></ProtectedRoute>} />
          <Route path="/dashboard/posts/:id/edit" element={<ProtectedRoute><PostFormPage /></ProtectedRoute>} />
          <Route path="/dashboard/categories" element={<ProtectedRoute><CategoryListPage /></ProtectedRoute>} />
          <Route path="/dashboard/categories/create" element={<ProtectedRoute adminOnly><CategoryFormPage /></ProtectedRoute>} />
          <Route path="/dashboard/categories/:id/edit" element={<ProtectedRoute adminOnly><CategoryFormPage /></ProtectedRoute>} />
          <Route path="/dashboard/users" element={<ProtectedRoute adminOnly><UserListPage /></ProtectedRoute>} />
          <Route path="/dashboard/users/create" element={<ProtectedRoute adminOnly><UserFormPage /></ProtectedRoute>} />
          <Route path="/dashboard/users/:id/edit" element={<ProtectedRoute adminOnly><UserFormPage /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

