'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalLeads: number
  totalDeals: number
  totalRevenue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
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
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, view system statistics, and oversee CRM operations</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="relative overflow-hidden bg-gradient-to-br from-red-600 via-purple-600 to-blue-600 rounded-2xl p-8 text-white mb-8 shadow-2xl">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-white bg-opacity-5 rounded-full"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                  <span className="text-3xl">👑</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-1">Welcome, Administrator!</h2>
                  <p className="text-red-100 text-lg">Master of the CRM Universe</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">∞</div>
                  <div className="text-sm text-red-100">Unlimited Access</div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">🛡️</div>
                  <div className="text-sm text-red-100">System Guardian</div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">⚡</div>
                  <div className="text-sm text-red-100">Power User</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {/* Total Users Card */}
            <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden shadow-lg rounded-2xl border border-blue-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500 bg-opacity-10 rounded-full -mr-10 -mt-10"></div>
              <div className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-blue-600 mb-1">{stats?.totalUsers || 0}</div>
                    <div className="text-sm font-medium text-blue-700">Total Users</div>
                    <div className="text-xs text-blue-500 mt-1">👥 System Wide</div>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-white text-xl">👥</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Users Card */}
            <div className="group relative bg-gradient-to-br from-green-50 to-green-100 overflow-hidden shadow-lg rounded-2xl border border-green-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-500 bg-opacity-10 rounded-full -mr-10 -mt-10"></div>
              <div className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-green-600 mb-1">{stats?.activeUsers || 0}</div>
                    <div className="text-sm font-medium text-green-700">Active Users</div>
                    <div className="text-xs text-green-500 mt-1">✅ Online Now</div>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-white text-xl">✅</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Leads Card */}
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

            {/* Total Deals Card */}
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

            {/* Total Revenue Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">💰</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                      <dd className="text-lg font-medium text-gray-900">${stats?.totalRevenue || 0}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/users" className="group relative bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-blue-200">
              <div className="absolute top-4 right-4 w-12 h-12 bg-blue-500 bg-opacity-10 rounded-full group-hover:scale-110 transition-transform"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
                  <span className="text-white text-2xl">👥</span>
                </div>
                <h3 className="text-xl font-bold text-blue-700 mb-2">Manage Users</h3>
                <p className="text-blue-600 text-sm">Control user access and permissions</p>
                <div className="mt-4 text-xs text-blue-500 font-medium">FULL CONTROL</div>
              </div>
            </Link>

            <Link href="/leads" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-yellow-600 text-lg">🎯</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Lead Management</h3>
              </div>
              <p className="text-gray-600 text-sm">View and manage all leads in the system</p>
            </Link>

            <Link href="/contacts" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-green-600 text-lg">📞</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Contact Management</h3>
              </div>
              <p className="text-gray-600 text-sm">Manage customer contacts and relationships</p>
            </Link>

            <Link href="/settings" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-gray-600 text-lg">⚙️</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">System Settings</h3>
              </div>
              <p className="text-gray-600 text-sm">Configure system settings and preferences</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}