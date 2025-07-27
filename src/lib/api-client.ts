// Client-side API helpers to avoid direct Supabase imports

export interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
}

export class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      const result = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Request failed'
        }
      }

      return {
        success: true,
        data: result.data || result
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      }
    }
  }

  // User management
  async getUsers(params?: {
    page?: number
    limit?: number
    search?: string
    role?: string
    status?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.search) searchParams.set('search', params.search)
    if (params?.role) searchParams.set('role', params.role)
    if (params?.status) searchParams.set('status', params.status)

    const query = searchParams.toString()
    return this.request(`/api/users${query ? `?${query}` : ''}`)
  }

  async createUser(userData: {
    firstName: string
    lastName: string
    email?: string
    roleId?: string
    phone?: string
    isActive?: boolean
  }) {
    return this.request('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  }

  async updateUser(id: string, userData: {
    firstName?: string
    lastName?: string
    roleId?: string
    phone?: string
    isActive?: boolean
  }) {
    return this.request(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    })
  }

  async deleteUser(id: string) {
    return this.request(`/api/users/${id}`, {
      method: 'DELETE'
    })
  }

  // Role management
  async getRoles() {
    return this.request('/api/roles')
  }

  async createRole(roleData: {
    name: string
    description?: string
    hierarchy?: number
  }) {
    return this.request('/api/roles', {
      method: 'POST',
      body: JSON.stringify(roleData)
    })
  }

  // Permission management
  async getPermissions() {
    return this.request('/api/permissions')
  }

  async getRolePermissions(roleId: string) {
    return this.request(`/api/roles/${roleId}/permissions`)
  }

  async updateRolePermissions(roleId: string, permissionIds: string[]) {
    return this.request(`/api/roles/${roleId}/permissions`, {
      method: 'POST',
      body: JSON.stringify({ permissionIds })
    })
  }

  // Database management
  async initializeDatabase() {
    return this.request('/api/init-database', {
      method: 'POST',
      body: JSON.stringify({ action: 'initialize' })
    })
  }

  async initializePermissions() {
    return this.request('/api/init-database', {
      method: 'POST',
      body: JSON.stringify({ action: 'init-permissions' })
    })
  }

  async testRLS(userId: string) {
    return this.request('/api/init-database', {
      method: 'POST',
      body: JSON.stringify({ action: 'test-rls', userId })
    })
  }

  async setupTables() {
    return this.request('/api/setup-tables', {
      method: 'POST'
    })
  }
}

// Export a default instance
export const apiClient = new ApiClient()