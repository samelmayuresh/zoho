'use client'

import Link from 'next/link'
import { NavItemProps } from './types'

export default function NavItem({ item, isActive, onClick }: NavItemProps) {
  const baseClasses = "inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
  const activeClasses = "bg-blue-100 text-blue-700 border-b-2 border-blue-500"
  const inactiveClasses = "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
  
  const classes = `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`

  return (
    <Link
      href={item.href}
      className={classes}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
    >
      {item.icon && (
        <span className="mr-2 text-lg" aria-hidden="true">
          {item.icon}
        </span>
      )}
      <span>{item.label}</span>
    </Link>
  )
}