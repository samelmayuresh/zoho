'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ViewerStats {
  totalLeads: number
  totalContacts: number
  totalDeals: number
  totalProjects: number
}

export default function ViewerDashboard() {
  const [stats, setStats] = useState<ViewerStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/viewer/stats')
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
          <h1 className="text-2xl font-bold text-gray-900">Viewer Dashboard</h1>
          <p className="text-gray-600">View CRM data, reports, and analytics</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl p-8 text-white mb-8 shadow-2xl">
            {/* Data Visualization Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="2"/>
                <circle cx="50" cy="50" r="25" fill="none" stroke="white" strokeWidth="1"/>
                <circle cx="50" cy="50" r="10" fill="white"/>
              </svg>
            </div>
            <div className="absolute bottom-0 left-0 w-24 h-24 opacity-10">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect x="10" y="60" width="15" height="30" fill="white"/>
                <rect x="30" y="40" width="15" height="50" fill="white"/>
                <rect x="50" y="20" width="15" height="70" fill="white"/>
                <rect x="70" y="50" width="15" height="40" fill="white"/>
              </svg>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-white to-emerald-100 bg-opacity-20 rounded-2xl flex items-center justify-center mr-6 backdrop-blur-sm">
                  <span className="text-4xl">👁️</span>
                </div>
                <div>
                  <h2 className="text-4xl font-bold mb-2">Analytics Hub</h2>
                  <p className="text-emerald-100 text-xl">Insights at your fingertips</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white bg-opacity-15 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-20">
                  <div className="text-3xl mb-3">📊</div>
                  <div className="text-lg font-semibold mb-1">Real-time Data</div>
                  <div className="text-sm text-emerald-100">Live insights and metrics</div>
                </div>
                <div className="bg-white bg-opacity-15 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-20">
                  <div className="text-3xl mb-3">🔍</div>
                  <div className="text-lg font-semibold mb-1">Deep Analysis</div>
                  <div className="text-sm text-emerald-100">Comprehensive reporting</div>
                </div>
                <div className="bg-white bg-opacity-15 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-20">
                  <div className="text-3xl mb-3">📈</div>
                  <div className="text-lg font-semibold mb-1">Trend Tracking</div>
                  <div className="text-sm text-emerald-100">Performance monitoring</div>
                </div>
              </div>
            </div>
          </div>

          {/* View Stats */}
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
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Leads</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats?.totalLeads || 0}</dd>
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
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Contacts</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats?.totalContacts || 0}</dd>
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
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Deals</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats?.totalDeals || 0}</dd>
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
                      <span className="text-white text-sm">📋</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Projects</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats?.totalProjects || 0}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Viewer Actions - Read Only */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/leads?view=readonly" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-yellow-600 text-lg">🎯</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">View Leads</h3>
              </div>
              <p className="text-gray-600 text-sm">Browse and search leads (read-only)</p>
            </Link>

            <Link href="/contacts?view=readonly" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-green-600 text-lg">📞</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">View Contacts</h3>
              </div>
              <p className="text-gray-600 text-sm">Browse customer contacts (read-only)</p>
            </Link>

            <Link href="/accounts?view=readonly" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-blue-600 text-lg">🏢</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">View Accounts</h3>
              </div>
              <p className="text-gray-600 text-sm">Browse company accounts (read-only)</p>
            </Link>

            <Link href="/deals?view=readonly" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-purple-600 text-lg">💼</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">View Deals</h3>
              </div>
              <p className="text-gray-600 text-sm">Browse sales pipeline (read-only)</p>
            </Link>

            <Link href="/projects?view=readonly" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-indigo-600 text-lg">📋</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">View Projects</h3>
              </div>
              <p className="text-gray-600 text-sm">Browse projects and tasks (read-only)</p>
            </Link>

            <Link href="/reports" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-gray-600 text-lg">📊</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">View Reports</h3>
              </div>
              <p className="text-gray-600 text-sm">Access reports and analytics</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}