'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface WorkspaceStats {
  myLeads: number
  myContacts: number
  myDeals: number
  myTasks: number
}

export default function EditorWorkspace() {
  const [stats, setStats] = useState<WorkspaceStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/editor/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
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
    <div className="bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Editor Workspace</h1>
          <p className="text-gray-600">Create and manage leads, contacts, accounts, and deals</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white mb-8 shadow-2xl">
            {/* Floating Elements */}
            <div className="absolute top-4 right-4 w-16 h-16 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
            <div className="absolute bottom-4 left-4 w-12 h-12 bg-white bg-opacity-10 rounded-full animate-bounce"></div>
            <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-white bg-opacity-10 rounded-full"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-white to-blue-100 bg-opacity-20 rounded-2xl flex items-center justify-center mr-6 backdrop-blur-sm">
                  <span className="text-4xl">✏️</span>
                </div>
                <div>
                  <h2 className="text-4xl font-bold mb-2">Creative Workspace</h2>
                  <p className="text-blue-100 text-xl">Where ideas become reality</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-white bg-opacity-15 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
                  <div className="text-2xl mb-2">🎨</div>
                  <div className="text-sm font-medium">Create</div>
                  <div className="text-xs text-blue-100">Design & Build</div>
                </div>
                <div className="bg-white bg-opacity-15 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="text-sm font-medium">Manage</div>
                  <div className="text-xs text-blue-100">Organize & Track</div>
                </div>
                <div className="bg-white bg-opacity-15 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
                  <div className="text-2xl mb-2">🚀</div>
                  <div className="text-sm font-medium">Launch</div>
                  <div className="text-xs text-blue-100">Deploy & Scale</div>
                </div>
                <div className="bg-white bg-opacity-15 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
                  <div className="text-2xl mb-2">📈</div>
                  <div className="text-sm font-medium">Analyze</div>
                  <div className="text-xs text-blue-100">Measure & Improve</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🎯</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">My Leads</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats?.myLeads || 0}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">📞</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">My Contacts</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats?.myContacts || 0}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">💼</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">My Deals</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats?.myDeals || 0}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✅</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">My Tasks</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats?.myTasks || 0}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Editor Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/leads/create" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-yellow-600 text-lg">➕</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Create Lead</h3>
              </div>
              <p className="text-gray-600 text-sm">Add new leads to the system</p>
            </Link>

            <Link href="/leads" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-yellow-600 text-lg">🎯</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Manage Leads</h3>
              </div>
              <p className="text-gray-600 text-sm">View and edit existing leads</p>
            </Link>

            <Link href="/contacts" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-green-600 text-lg">📞</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Contact Management</h3>
              </div>
              <p className="text-gray-600 text-sm">Manage customer contacts</p>
            </Link>

            <Link href="/deals" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-purple-600 text-lg">💼</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Deal Pipeline</h3>
              </div>
              <p className="text-gray-600 text-sm">Manage sales opportunities</p>
            </Link>

            <Link href="/projects" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-indigo-600 text-lg">📋</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Project Management</h3>
              </div>
              <p className="text-gray-600 text-sm">Manage projects and tasks</p>
            </Link>

            <Link href="/reports" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-gray-600 text-lg">📊</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Reports</h3>
              </div>
              <p className="text-gray-600 text-sm">View performance reports</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}