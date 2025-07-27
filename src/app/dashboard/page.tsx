'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  username: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const userData = await response.json()
          setUser(userData.user)
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      // Clear cookie manually to ensure immediate effect
      document.cookie = 'crm-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      // Force redirect to login page
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout failed:', error)
      // Fallback: clear cookie manually and redirect
      document.cookie = 'crm-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      window.location.href = '/login'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Zoho CRM Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user.firstName} {user.lastName}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {user.role}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Information Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                🎉 Role-based Authentication Working!
              </h2>
              <p className="text-gray-600 mb-4">
                You are successfully logged in to the Zoho CRM system.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {user.email}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Username:</strong> {user.username}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Role:</strong> {user.role}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Name:</strong> {user.firstName} {user.lastName}
                </p>
              </div>
            </div>

            {/* Role-specific Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                🚀 Role-specific Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {user.role === 'ADMIN' && (
                  <>
                    <button
                      onClick={() => router.push('/admin/dashboard')}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium text-center"
                    >
                      Admin Dashboard
                    </button>
                    <button
                      onClick={() => router.push('/admin/create-user')}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium text-center"
                    >
                      Create User
                    </button>
                  </>
                )}
                {user.role === 'EDITOR' && (
                  <button
                    onClick={() => router.push('/editor/workspace')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium text-center"
                  >
                    Editor Workspace
                  </button>
                )}
                {user.role === 'VIEWER' && (
                  <button
                    onClick={() => router.push('/viewer/dashboard')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium text-center"
                  >
                    Viewer Dashboard
                  </button>
                )}
                {user.role === 'PARTNER' && (
                  <button
                    onClick={() => router.push('/partner/portal')}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium text-center"
                  >
                    Partner Portal
                  </button>
                )}
                <button
                  onClick={() => router.push('/users')}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md text-sm font-medium text-center"
                >
                  Manage Users
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}