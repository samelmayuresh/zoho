'use client'

import { useState, useEffect } from 'react'
import { User } from '@/components/navigation/types'

interface UseAuthReturn {
  user: User | null
  isLoading: boolean
  error: string | null
  refreshUser: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include'
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      } else if (response.status === 401) {
        // User not authenticated
        setUser(null)
      } else {
        throw new Error('Failed to fetch user data')
      }
    } catch (err) {
      console.error('Auth error:', err)
      setError(err instanceof Error ? err.message : 'Authentication error')
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUser = async () => {
    await fetchUser()
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return {
    user,
    isLoading,
    error,
    refreshUser
  }
}