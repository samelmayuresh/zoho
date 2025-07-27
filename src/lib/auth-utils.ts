import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'
import { Role } from '@prisma/client'

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Generate simple password for testing
export function generateSimplePassword(): string {
  const adjectives = ['quick', 'bright', 'happy', 'smart', 'cool', 'fast', 'nice', 'good']
  const nouns = ['cat', 'dog', 'bird', 'fish', 'lion', 'bear', 'wolf', 'fox']
  const numbers = Math.floor(Math.random() * 99) + 1
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  
  return `${adjective}${noun}${numbers}`
}

// Generate strong password with symbols (backup)
export function generateStrongPassword(): string {
  const length = 16
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'
  let password = ''
  
  // Ensure at least one of each type
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)] // lowercase
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)] // uppercase
  password += '0123456789'[Math.floor(Math.random() * 10)] // number
  password += '!@#$%^&*()_+-='[Math.floor(Math.random() * 13)] // symbol
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

// Generate username based on role
export function generateUsername(role: Role): string {
  const rolePrefix = role.toLowerCase()
  const suffix = nanoid(6)
  return `${rolePrefix}_${suffix}`
}

// Generate credentials for new users
export function generateCredentials(firstName?: string, lastName?: string, email?: string): { username: string, password: string } {
  // Generate username from name or email
  let baseUsername = ''
  
  if (firstName && lastName) {
    baseUsername = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`
  } else if (email) {
    baseUsername = email.split('@')[0]
  } else {
    baseUsername = 'user'
  }
  
  // Clean username and add random suffix
  const cleanUsername = baseUsername.replace(/[^a-z0-9]/g, '').substring(0, 10)
  const username = `${cleanUsername}_${nanoid(4)}`
  
  // Generate simple password for easier testing
  const password = generateSimplePassword()
  
  return { username, password }
}

// Role validation
export function isValidRole(role: string): role is Role {
  return ['ADMIN', 'EDITOR', 'VIEWER', 'PARTNER'].includes(role)
}

// Role hierarchy for permissions
export const ROLE_HIERARCHY = {
  ADMIN: 100,
  EDITOR: 75,
  VIEWER: 50,
  PARTNER: 25
}

export function hasHigherRole(userRole: Role, targetRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] > ROLE_HIERARCHY[targetRole]
}

// Role-based redirects
export function getRoleRedirect(role: Role): string {
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

// Role permissions
export const ROLE_PERMISSIONS = {
  ADMIN: [
    'users:manage',
    'leads:manage',
    'contacts:manage',
    'accounts:manage',
    'deals:manage',
    'projects:manage',
    'reports:view',
    'settings:manage'
  ],
  EDITOR: [
    'leads:manage',
    'contacts:manage',
    'accounts:manage',
    'deals:manage',
    'projects:manage',
    'reports:view'
  ],
  VIEWER: [
    'leads:view',
    'contacts:view',
    'accounts:view',
    'deals:view',
    'projects:view',
    'reports:view'
  ],
  PARTNER: [
    'leads:create',
    'contacts:view',
    'accounts:view',
    'deals:view',
    'projects:view'
  ]
}

export function hasPermission(userRole: Role, permission: string): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false
}