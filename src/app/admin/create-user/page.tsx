'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function CreateUserPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'VIEWER',
    sendSMS: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showCredentials, setShowCredentials] = useState(false)
  const [userCredentials, setUserCredentials] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user')
      }

      // Always show credentials popup for admin
      setUserCredentials({
        username: data.user?.username || 'N/A',
        password: data.credentials?.password || 'Check server logs',
        email: formData.email,
        role: formData.role,
        loginUrl: 'http://localhost:3000/login'
      })
      setShowCredentials(true)
      setMessage(`✅ User created successfully!`)

      // Reset form
      setFormData({ firstName: '', lastName: '', email: '', phone: '', role: 'VIEWER', sendSMS: false })
    } catch (err: any) {
      setError(err.message || 'Failed to create user')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }))
  }

  return (
    <div className="bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-500 font-medium">
              ← Back to Dashboard
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New User</h1>
              <p className="text-gray-600">Add a new user to the CRM system</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Create New User Account</h2>

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm mb-6">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1234567890"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">Include country code (e.g., +1 for US)</p>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ADMIN">Administrator - Full system access</option>
                <option value="EDITOR">Editor - Can create and edit records</option>
                <option value="VIEWER">Viewer - Read-only access</option>
                <option value="PARTNER">Partner - Limited access for external partners</option>
              </select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="sendSMS"
                  name="sendSMS"
                  type="checkbox"
                  checked={formData.sendSMS}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="sendSMS" className="ml-2 block text-sm text-gray-900">
                  Send credentials via SMS (requires phone number)
                </label>
              </div>

              {formData.sendSMS && !formData.phone && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <p className="text-sm text-yellow-800">
                    📱 Please enter a phone number to send SMS credentials
                  </p>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">What happens next:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• A unique username and secure password will be generated</li>
                <li>• Login credentials will be sent via email{formData.sendSMS ? ' and SMS' : ''}</li>
                <li>• The user can log in using the role-based credential system</li>
                <li>• They will be redirected to their role-specific dashboard</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-4">
              <Link
                href="/admin/dashboard"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Creating User...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Credentials Popup Modal */}
      {showCredentials && userCredentials && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">🔐 User Credentials Created</h3>
                <button
                  onClick={() => setShowCredentials(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-800 mb-3">
                  ✅ User account created successfully! Please provide these credentials to the user:
                </p>

                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border">
                    <label className="block text-xs font-medium text-gray-500 mb-1">EMAIL</label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono">{userCredentials.email}</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(userCredentials.email)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded border">
                    <label className="block text-xs font-medium text-gray-500 mb-1">USERNAME</label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono">{userCredentials.username}</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(userCredentials.username)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded border">
                    <label className="block text-xs font-medium text-gray-500 mb-1">PASSWORD</label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono">{userCredentials.password}</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(userCredentials.password)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded border">
                    <label className="block text-xs font-medium text-gray-500 mb-1">ROLE</label>
                    <span className="text-sm">{userCredentials.role}</span>
                  </div>

                  <div className="bg-white p-3 rounded border">
                    <label className="block text-xs font-medium text-gray-500 mb-1">LOGIN URL</label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono text-blue-600">{userCredentials.loginUrl}</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(userCredentials.loginUrl)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-yellow-800">
                  ⚠️ <strong>Important:</strong> Please share these credentials securely with the user.
                  They should change their password after first login.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    const credentials = `Login Credentials for ${userCredentials.email}:\n\nUsername: ${userCredentials.username}\nPassword: ${userCredentials.password}\nLogin URL: ${userCredentials.loginUrl}\n\nRole: ${userCredentials.role}`;
                    navigator.clipboard.writeText(credentials);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  📋 Copy All
                </button>
                <button
                  onClick={() => setShowCredentials(false)}
                  className="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}