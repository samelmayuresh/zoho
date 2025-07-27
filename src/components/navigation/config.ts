// Navigation configuration and menu items

import { NavItem, Role } from './types'

export const navigationItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: '🏠',
    roles: ['ADMIN', 'EDITOR', 'VIEWER', 'PARTNER']
  },
  {
    label: 'Users',
    href: '/users',
    icon: '👥',
    roles: ['ADMIN']
  },
  {
    label: 'Create User',
    href: '/admin/create-user',
    icon: '➕',
    roles: ['ADMIN']
  },
  {
    label: 'Leads',
    href: '/leads',
    icon: '🎯',
    roles: ['ADMIN', 'EDITOR']
  },
  {
    label: 'Contacts',
    href: '/contacts',
    icon: '👤',
    roles: ['ADMIN', 'EDITOR']
  },
  {
    label: 'Accounts',
    href: '/accounts',
    icon: '🏢',
    roles: ['ADMIN', 'EDITOR']
  },
  {
    label: 'Deals',
    href: '/deals',
    icon: '💼',
    roles: ['ADMIN', 'EDITOR']
  },
  {
    label: 'Projects',
    href: '/projects',
    icon: '📋',
    roles: ['ADMIN', 'EDITOR']
  },
  {
    label: 'Reports',
    href: '/reports',
    icon: '📊',
    roles: ['ADMIN', 'EDITOR', 'VIEWER']
  },
  {
    label: 'Partner Portal',
    href: '/partner/portal',
    icon: '🤝',
    roles: ['ADMIN', 'PARTNER']
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: '⚙️',
    roles: ['ADMIN']
  }
]

export const getRoleDashboard = (role: Role): string => {
  switch (role) {
    case 'ADMIN':
      return '/admin/dashboard'
    case 'EDITOR':
      return '/editor/workspace'
    case 'VIEWER':
      return '/viewer/dashboard'
    case 'PARTNER':
      return '/partner/portal'
    default:
      return '/dashboard'
  }
}

export const getFilteredNavItems = (userRole: Role): NavItem[] => {
  return navigationItems.filter(item => item.roles.includes(userRole))
}

export const getRoleDisplayName = (role: Role): string => {
  switch (role) {
    case 'ADMIN':
      return 'Administrator'
    case 'EDITOR':
      return 'Editor'
    case 'VIEWER':
      return 'Viewer'
    case 'PARTNER':
      return 'Partner'
    default:
      return role
  }
}

export const getRoleColor = (role: Role): string => {
  switch (role) {
    case 'ADMIN':
      return 'bg-red-100 text-red-800'
    case 'EDITOR':
      return 'bg-blue-100 text-blue-800'
    case 'VIEWER':
      return 'bg-green-100 text-green-800'
    case 'PARTNER':
      return 'bg-orange-100 text-orange-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}