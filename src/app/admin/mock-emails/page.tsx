'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface MockEmail {
  to: string
  subject: string
  body: string
  timestamp: string
  credentials: {
    username: string
    password: string
    loginUrl: string
  }
}

export default function MockEmailsPage() {
  const [emails, setEmails] = useState<MockEmail[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEmails()
  }, [])

  const fetchEmails = async () => {
    try {
      const response = await fetch('/api/admin/mock-emails')
      if (response.ok) {
        const data = await response.json()
        setEmails(data.emails || [])
      }
    } catch (error) {
      console.error('Failed to fetch emails:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearEmails = async () => {
    try {
      const response = await fetch('/api/admin/mock-emails', { method: 'DELETE' })
      if (response.ok) {
        setEmails([])
      }
    } catch (error) {
      console.error('Failed to clear emails:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-500">
                ← Back to Dashboard
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Mock Emails</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchEmails}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Refresh
              </button>
              <button
                onClick={clearEmails}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {emails.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Mock Emails</h3>
              <p className="text-gray-600 mb-4">Create a user to see mock emails here.</p>
              <Link
                href="/admin/create-user"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Create User
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h2 className="text-lg font-medium text-blue-900 mb-2">📧 Mock Email System</h2>
                <p className="text-blue-700 text-sm">
                  These are simulated emails that would be sent to users. In production, configure Resend API key to send real emails.
                </p>
              </div>

              {emails.map((email, index) => (
                <div key={index} className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{email.subject}</h3>
                        <p className="text-sm text-gray-600">To: {email.to}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(email.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4">
                    <div className="bg-gray-50 rounded-md p-4 mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">🔐 Login Credentials:</h4>
                      <div className="space-y-1 text-sm">
                        <p><strong>Username:</strong> <code className="bg-gray-200 px-2 py-1 rounded">{email.credentials.username}</code></p>
                        <p><strong>Password:</strong> <code className="bg-gray-200 px-2 py-1 rounded">{email.credentials.password}</code></p>
                        <p><strong>Login URL:</strong> <a href={email.credentials.loginUrl} className="text-blue-600 hover:text-blue-500">{email.credentials.loginUrl}</a></p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-md p-4">
                      <h4 className="font-medium text-gray-900 mb-2">📄 Email Content:</h4>
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">{email.body}</pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}