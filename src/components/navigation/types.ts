// Navigation system type definitions

export type Role = 'ADMIN' | 'EDITOR' | 'VIEWER' | 'PARTNER'

export interface User {
  id: string
  username: string
  role: Role
  firstName?: string
  lastName?: string
  email?: string
}

export interface NavItem {
  label: string
  href: string
  icon?: string
  roles: Role[]
  isActive?: boolean
}

export interface NavbarProps {
  user?: User
  currentPath: string
}

export interface NavigationState {
  isMobileMenuOpen: boolean
  isUserMenuOpen: boolean
  currentPath: string
  activeItem: string | null
}

export interface UserMenuProps {
  user: User
  onLogout: () => Promise<void>
  isOpen: boolean
  onToggle: () => void
}

export interface RoleBadgeProps {
  role: Role
  size?: 'sm' | 'md' | 'lg'
}

export interface MobileMenuProps {
  isOpen: boolean
  onToggle: () => void
  navItems: NavItem[]
  user?: User
  onLogout: () => Promise<void>
}

export interface NavItemProps {
  item: NavItem
  isActive: boolean
  onClick?: () => void
}