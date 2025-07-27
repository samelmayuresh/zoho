'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'

interface Permission {
  id: string
  name: string
  resource: string
  action: string
  description?: string
}

export function usePermissions() {
  const { user } = useAuth()
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      fetchUserPermissions()
    } else {
      setPermissions([])
      setLoading(false)
    }
  }, [user?.id])

  const fetchUserPermissions = async () => {
    try {
      // Mock permissions based on user role
      let mockPermissions: Permission[] = []
      
      if (user?.role === 'ADMIN') {
        mockPermissions = [
          { id: '1', name: 'Manage Users', resource: 'users', action: 'manage' },
          { id: '2', name: 'View Reports', resource: 'reports', action: 'view' },
          { id: '3', name: 'Manage Leads', resource: 'leads', action: 'manage' },
          { id: '4', name: 'Manage Contacts', resource: 'contacts', action: 'manage' },
          { id: '5', name: 'Manage Deals', resource: 'deals', action: 'manage' },
          { id: '6', name: 'Manage Projects', resource: 'projects', action: 'manage' }
        ]
      } else if (user?.role === 'EDITOR') {
        mockPermissions = [
          { id: '2', name: 'View Reports', resource: 'reports', action: 'view' },
          { id: '3', name: 'Manage Leads', resource: 'leads', action: 'manage' },
          { id: '4', name: 'Manage Contacts', resource: 'contacts', action: 'manage' },
          { id: '5', name: 'Manage Deals', resource: 'deals', action: 'manage' },
          { id: '6', name: 'Manage Projects', resource: 'projects', action: 'manage' }
        ]
      } else if (user?.role === 'VIEWER') {
        mockPermissions = [
          { id: '2', name: 'View Reports', resource: 'reports', action: 'view' },
          { id: '7', name: 'View Leads', resource: 'leads', action: 'view' },
          { id: '8', name: 'View Contacts', resource: 'contacts', action: 'view' }
        ]
      } else if (user?.role === 'PARTNER') {
        mockPermissions = [
          { id: '7', name: 'View Leads', resource: 'leads', action: 'view' },
          { id: '9', name: 'Create Leads', resource: 'leads', action: 'create' }
        ]
      }
      
      setPermissions(mockPermissions)
    } catch (error) {
      console.error('Error fetching permissions:', error)
      setPermissions([])
    } finally {
      setLoading(false)
    }
  }

  const hasPermission = (resource: string, action: string): boolean => {
    return permissions.some(p => p.resource === resource && p.action === action)
  }

  const hasResourceAccess = (resource: string): boolean => {
    return permissions.some(p => p.resource === resource)
  }

  const canManage = (resource: string): boolean => {
    return hasPermission(resource, 'manage')
  }

  const canView = (resource: string): boolean => {
    return hasPermission(resource, 'view') || hasPermission(resource, 'manage')
  }

  const canCreate = (resource: string): boolean => {
    return hasPermission(resource, 'create') || hasPermission(resource, 'manage')
  }

  const canUpdate = (resource: string): boolean => {
    return hasPermission(resource, 'update') || hasPermission(resource, 'manage')
  }

  const canDelete = (resource: string): boolean => {
    return hasPermission(resource, 'delete') || hasPermission(resource, 'manage')
  }

  return {
    permissions,
    loading,
    hasPermission,
    hasResourceAccess,
    canManage,
    canView,
    canCreate,
    canUpdate,
    canDelete
  }
}

// Permission-based component wrapper
interface PermissionGuardProps {
  resource: string
  action: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function PermissionGuard({ 
  resource, 
  action, 
  children, 
  fallback = null 
}: PermissionGuardProps) {
  const { hasPermission, loading } = usePermissions()

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
  }

  if (!hasPermission(resource, action)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// Role-based component wrapper
interface RoleGuardProps {
  allowedRoles: string[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function RoleGuard({ 
  allowedRoles, 
  children, 
  fallback = null 
}: RoleGuardProps) {
  const { user } = useAuth()

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}