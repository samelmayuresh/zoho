import { supabaseAdmin } from './supabase'

export interface Permission {
  id: string
  name: string
  resource: string
  action: string
  description?: string
}

export interface UserWithPermissions {
  id: string
  first_name: string
  last_name: string
  role?: {
    id: string
    name: string
    hierarchy: number
  }
  permissions?: Permission[]
}

// Get user permissions
export async function getUserPermissions(userId: string): Promise<Permission[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .select(`
        role:roles(
          id,
          name,
          hierarchy,
          role_permissions(
            permission:permissions(*)
          )
        )
      `)
      .eq('id', userId)
      .single()

    if (error || !data?.role) {
      return []
    }

    const permissions = data.role.role_permissions?.map(rp => rp.permission) || []
    return permissions.filter(Boolean)
  } catch (error) {
    console.error('Error fetching user permissions:', error)
    return []
  }
}

// Check if user has specific permission
export async function userHasPermission(
  userId: string, 
  resource: string, 
  action: string
): Promise<boolean> {
  try {
    const permissions = await getUserPermissions(userId)
    return permissions.some(p => p.resource === resource && p.action === action)
  } catch (error) {
    console.error('Error checking user permission:', error)
    return false
  }
}

// Check if user has any permission for a resource
export async function userHasResourceAccess(
  userId: string, 
  resource: string
): Promise<boolean> {
  try {
    const permissions = await getUserPermissions(userId)
    return permissions.some(p => p.resource === resource)
  } catch (error) {
    console.error('Error checking resource access:', error)
    return false
  }
}

// Get user role hierarchy level
export async function getUserHierarchy(userId: string): Promise<number> {
  try {
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .select(`
        role:roles(hierarchy)
      `)
      .eq('id', userId)
      .single()

    if (error || !data?.role) {
      return 0
    }

    return data.role.hierarchy || 0
  } catch (error) {
    console.error('Error fetching user hierarchy:', error)
    return 0
  }
}

// Check if user can manage another user (based on hierarchy)
export async function canManageUser(
  managerId: string, 
  targetUserId: string
): Promise<boolean> {
  try {
    const [managerHierarchy, targetHierarchy] = await Promise.all([
      getUserHierarchy(managerId),
      getUserHierarchy(targetUserId)
    ])

    return managerHierarchy > targetHierarchy
  } catch (error) {
    console.error('Error checking user management permission:', error)
    return false
  }
}

// Default permissions for each role
export const DEFAULT_PERMISSIONS = {
  'Super Admin': [
    { name: 'Manage Users', resource: 'users', action: 'manage' },
    { name: 'Manage Roles', resource: 'roles', action: 'manage' },
    { name: 'Manage Leads', resource: 'leads', action: 'manage' },
    { name: 'Manage Contacts', resource: 'contacts', action: 'manage' },
    { name: 'Manage Accounts', resource: 'accounts', action: 'manage' },
    { name: 'Manage Deals', resource: 'deals', action: 'manage' },
    { name: 'Manage Projects', resource: 'projects', action: 'manage' },
    { name: 'View Reports', resource: 'reports', action: 'view' },
    { name: 'Manage Settings', resource: 'settings', action: 'manage' }
  ],
  'Admin': [
    { name: 'View Users', resource: 'users', action: 'view' },
    { name: 'Manage Leads', resource: 'leads', action: 'manage' },
    { name: 'Manage Contacts', resource: 'contacts', action: 'manage' },
    { name: 'Manage Accounts', resource: 'accounts', action: 'manage' },
    { name: 'Manage Deals', resource: 'deals', action: 'manage' },
    { name: 'Manage Projects', resource: 'projects', action: 'manage' },
    { name: 'View Reports', resource: 'reports', action: 'view' }
  ],
  'Sales Manager': [
    { name: 'View Users', resource: 'users', action: 'view' },
    { name: 'Manage Leads', resource: 'leads', action: 'manage' },
    { name: 'Manage Contacts', resource: 'contacts', action: 'manage' },
    { name: 'Manage Accounts', resource: 'accounts', action: 'manage' },
    { name: 'Manage Deals', resource: 'deals', action: 'manage' },
    { name: 'View Reports', resource: 'reports', action: 'view' }
  ],
  'Project Manager': [
    { name: 'View Users', resource: 'users', action: 'view' },
    { name: 'View Contacts', resource: 'contacts', action: 'view' },
    { name: 'View Accounts', resource: 'accounts', action: 'view' },
    { name: 'Manage Projects', resource: 'projects', action: 'manage' },
    { name: 'View Reports', resource: 'reports', action: 'view' }
  ],
  'Sales Rep': [
    { name: 'Create Leads', resource: 'leads', action: 'create' },
    { name: 'View Leads', resource: 'leads', action: 'view' },
    { name: 'Update Leads', resource: 'leads', action: 'update' },
    { name: 'View Contacts', resource: 'contacts', action: 'view' },
    { name: 'Create Contacts', resource: 'contacts', action: 'create' },
    { name: 'View Accounts', resource: 'accounts', action: 'view' },
    { name: 'View Deals', resource: 'deals', action: 'view' },
    { name: 'Create Deals', resource: 'deals', action: 'create' }
  ],
  'User': [
    { name: 'View Own Profile', resource: 'profile', action: 'view' },
    { name: 'Update Own Profile', resource: 'profile', action: 'update' }
  ]
}

// Initialize default permissions
export async function initializeDefaultPermissions() {
  try {
    console.log('Initializing default permissions...')

    // Create all unique permissions
    const allPermissions = new Set<string>()
    Object.values(DEFAULT_PERMISSIONS).forEach(permissions => {
      permissions.forEach(p => {
        allPermissions.add(`${p.name}|${p.resource}|${p.action}`)
      })
    })

    // Insert permissions
    const permissionsToInsert = Array.from(allPermissions).map(permStr => {
      const [name, resource, action] = permStr.split('|')
      return { name, resource, action }
    })

    const { error: permError } = await supabaseAdmin
      .from('permissions')
      .upsert(permissionsToInsert, { onConflict: 'name' })

    if (permError) {
      console.error('Error creating permissions:', permError)
      return { success: false, error: permError }
    }

    // Get all permissions and roles
    const { data: permissions } = await supabaseAdmin
      .from('permissions')
      .select('*')

    const { data: roles } = await supabaseAdmin
      .from('roles')
      .select('*')

    if (!permissions || !roles) {
      return { success: false, error: 'Failed to fetch permissions or roles' }
    }

    // Assign permissions to roles
    for (const role of roles) {
      const rolePermissions = DEFAULT_PERMISSIONS[role.name as keyof typeof DEFAULT_PERMISSIONS]
      if (rolePermissions) {
        const rolePermissionMappings = rolePermissions.map(rp => {
          const permission = permissions.find(p => p.name === rp.name)
          return permission ? {
            role_id: role.id,
            permission_id: permission.id
          } : null
        }).filter(Boolean)

        if (rolePermissionMappings.length > 0) {
          await supabaseAdmin
            .from('role_permissions')
            .upsert(rolePermissionMappings, { onConflict: 'role_id,permission_id' })
        }
      }
    }

    console.log('✅ Default permissions initialized')
    return { success: true }
  } catch (error) {
    console.error('Error initializing permissions:', error)
    return { success: false, error }
  }
}