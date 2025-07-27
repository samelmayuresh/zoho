'use client'

import { RoleBadgeProps } from './types'
import { getRoleDisplayName, getRoleColor } from './config'

export default function RoleBadge({ role, size = 'md' }: RoleBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  }

  const roleIcons = {
    ADMIN: '👑',
    EDITOR: '✏️',
    VIEWER: '👁️',
    PARTNER: '🤝'
  }

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${getRoleColor(role)} ${sizeClasses[size]}`}
    >
      <span className="mr-1" aria-hidden="true">
        {roleIcons[role]}
      </span>
      {getRoleDisplayName(role)}
    </span>
  )
}