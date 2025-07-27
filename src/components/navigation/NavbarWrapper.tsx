'use client'

import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Navbar from './Navbar'

function AuthenticatedNavbar({ pathname }: { pathname: string }) {
  const { user, isLoading } = useAuth()

  // Show loading state
  if (isLoading) {
    return (
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2 text-xl font-bold text-blue-600">
                <span className="text-2xl">🏢</span>
                <span>Zoho CRM</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="animate-pulse">
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return <Navbar user={user || undefined} currentPath={pathname} />
}

export default function NavbarWrapper() {
  const pathname = usePathname()
  
  // Don't show navbar on login page
  if (pathname === '/login') {
    return null
  }

  return <AuthenticatedNavbar pathname={pathname} />
}