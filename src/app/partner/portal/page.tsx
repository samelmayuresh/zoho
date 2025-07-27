'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface PartnerStats {
  myLeads: number
  assignedLeads: number
  convertedLeads: number
  pendingTasks: number
}

export default function PartnerPortal() {
  const [stats, setStats] = useState<PartnerStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/partner/stats')
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
          <h1 className="text-2xl font-bold text-gray-900">Partner Portal</h1>
          <p className="text-gray-600">Manage your leads and collaborate with our team</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-3xl p-8 text-white mb-8 shadow-2xl">
            {/* Partnership Network Elements */}
            <div className="absolute top-4 right-4 w-20 h-20 opacity-20">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="20" cy="20" r="8" fill="white"/>
                <circle cx="80" cy="20" r="8" fill="white"/>
                <circle cx="50" cy="50" r="12" fill="white"/>
                <circle cx="20" cy="80" r="8" fill="white"/>
                <circle cx="80" cy="80" r="8" fill="white"/>
                <line x1="20" y1="20" x2="50" y2="50" stroke="white" strokeWidth="2"/>
                <line x1="80" y1="20" x2="50" y2="50" stroke="white" strokeWidth="2"/>
                <line x1="20" y1="80" x2="50" y2="50" stroke="white" strokeWidth="2"/>
                <line x1="80" y1="80" x2="50" y2="50" stroke="white" strokeWidth="2"/>
              </svg>
            </div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-white to-orange-100 bg-opacity-20 rounded-2xl flex items-center justify-center mr-6 backdrop-blur-sm">
                  <span className="text-4xl">🤝</span>
                </div>
                <div>
                  <h2 className="text-4xl font-bold mb-2">Partnership Hub</h2>
                  <p className="text-orange-100 text-xl">Stronger together</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-white bg-opacity-15 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
                  <div className="text-2xl mb-2">🌟</div>
                  <div className="text-sm font-medium">Collaborate</div>
                  <div className="text-xs text-orange-100">Work Together</div>
                </div>
                <div className="bg-white bg-opacity-15 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="text-sm font-medium">Generate</div>
                  <div className="text-xs text-orange-100">Create Leads</div>
                </div>
                <div className="bg-white bg-opacity-15 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="text-sm font-medium">Track</div>
                  <div className="text-xs text-orange-100">Monitor Progress</div>
                </div>
                <div className="bg-white bg-opacity-15 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
                  <div className="text-2xl mb-2">🚀</div>
                  <div className="text-sm font-medium">Grow</div>
                  <div className="text-xs text-orange-100">Scale Success</div>
                </div>
              </div>
            </div>
          </div>

          {/* Partner Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">➕</span>
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
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🎯</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Assigned Leads</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats?.assignedLeads || 0}</dd>
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
                      <span className="text-white text-sm">✅</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Converted</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats?.convertedLeads || 0}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">⏰</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Pending Tasks</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats?.pendingTasks || 0}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Partner Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/leads/create" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-blue-600 text-lg">➕</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Create Lead</h3>
              </div>
              <p className="text-gray-600 text-sm">Submit new leads to the system</p>
            </Link>

            <Link href="/leads/my-leads" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-yellow-600 text-lg">🎯</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">My Leads</h3>
              </div>
              <p className="text-gray-600 text-sm">View and update your submitted leads</p>
            </Link>

            <Link href="/contacts/assigned" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-green-600 text-lg">📞</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Assigned Contacts</h3>
              </div>
              <p className="text-gray-600 text-sm">View contacts assigned to you</p>
            </Link>

            <Link href="/deals/partner-deals" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-purple-600 text-lg">💼</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Partner Deals</h3>
              </div>
              <p className="text-gray-600 text-sm">View deals related to your leads</p>
            </Link>

            <Link href="/projects/partner-projects" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-indigo-600 text-lg">📋</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Partner Projects</h3>
              </div>
              <p className="text-gray-600 text-sm">View projects you're involved in</p>
            </Link>

            <Link href="/reports/partner-performance" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-gray-600 text-lg">📊</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Performance Reports</h3>
              </div>
              <p className="text-gray-600 text-sm">View your performance metrics</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}