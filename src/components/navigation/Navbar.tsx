'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { NavbarProps, NavigationState } from './types'
import { getFilteredNavItems } from './config'
import NavItem from './NavItem'
import UserMenu from './UserMenu'
import MobileMenu from './MobileMenu'

export default function Navbar({ user, currentPath }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  
  const [navState, setNavState] = useState<NavigationState>({
    isMobileMenuOpen: false,
    isUserMenuOpen: false,
    currentPath: currentPath || pathname,
    activeItem: null
  })

  // Update current path when pathname changes
  useEffect(() => {
    setNavState(prev => ({ ...prev, currentPath: pathname }))
  }, [pathname])

  // Get navigation items based on user role
  const navItems = user ? getFilteredNavItems(user.role) : []

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      // Clear cookie manually to ensure immediate effect
      document.cookie = 'crm-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      // Force redirect to welcome page
      window.location.href = '/'
    } catch (error) {
      console.error('Logout failed:', error)
      // Fallback: clear cookie manually and redirect
      document.cookie = 'crm-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      window.location.href = '/'
    }
  }

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setNavState(prev => ({
      ...prev,
      isMobileMenuOpen: !prev.isMobileMenuOpen,
      isUserMenuOpen: false // Close user menu when opening mobile menu
    }))
  }

  // Toggle user menu
  const toggleUserMenu = () => {
    setNavState(prev => ({
      ...prev,
      isUserMenuOpen: !prev.isUserMenuOpen,
      isMobileMenuOpen: false // Close mobile menu when opening user menu
    }))
  }

  // Close all menus
  const closeAllMenus = () => {
    setNavState(prev => ({
      ...prev,
      isMobileMenuOpen: false,
      isUserMenuOpen: false
    }))
  }

  // Check if nav item is active
  const isNavItemActive = (href: string): boolean => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || 
             pathname === '/admin/dashboard' || 
             pathname === '/editor/workspace' || 
             pathname === '/viewer/dashboard' || 
             pathname === '/partner/portal'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo/Brand Section */}
            <div className="flex items-center">
              <Link 
                href="/" 
                className="flex items-center space-x-2 text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <span className="text-2xl">🏢</span>
                <span>Zoho CRM</span>
              </Link>
            </div>

            {/* Desktop Navigation Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  isActive={isNavItemActive(item.href)}
                />
              ))}
            </div>

            {/* User Section */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  {/* Desktop User Menu */}
                  <div className="hidden md:block">
                    <UserMenu
                      user={user}
                      onLogout={handleLogout}
                      isOpen={navState.isUserMenuOpen}
                      onToggle={toggleUserMenu}
                    />
                  </div>
                  
                  {/* Mobile Menu Button */}
                  <button
                    onClick={toggleMobileMenu}
                    className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                    aria-expanded="false"
                  >
                    <span className="sr-only">Open main menu</span>
                    {navState.isMobileMenuOpen ? (
                      <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    )}
                  </button>
                </>
              ) : (
                /* Non-authenticated user buttons */
                <div className="flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/login"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {user && (
          <MobileMenu
            isOpen={navState.isMobileMenuOpen}
            onToggle={toggleMobileMenu}
            navItems={navItems}
            user={user}
            onLogout={handleLogout}
          />
        )}
      </nav>

      {/* Overlay for mobile menu */}
      {(navState.isMobileMenuOpen || navState.isUserMenuOpen) && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-25 md:hidden"
          onClick={closeAllMenus}
        />
      )}
    </>
  )
}