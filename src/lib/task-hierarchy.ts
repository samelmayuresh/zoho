// Task Management Hierarchy Service

import { Role } from '@prisma/client'

export interface User {
  id: string
  role: Role
  firstName?: string
  lastName?: string
  email: string
  isActive: boolean
}

/**
 * Task Hierarchy Service
 * Manages role-based task assignment permissions
 */
export class TaskHierarchyService {
  /**
   * Role hierarchy definition
   * Higher roles can assign tasks to lower roles
   */
  private static readonly ROLE_HIERARCHY: Record<Role, Role[]> = {
    ADMIN: ['ADMIN', 'EDITOR', 'VIEWER', 'PARTNER'],
    EDITOR: ['VIEWER', 'PARTNER'],
    VIEWER: ['PARTNER'],
    PARTNER: []
  }

  /**
   * Check if a user can assign tasks to another user based on role hierarchy
   * @param assignerRole - Role of the user creating/assigning the task
   * @param assigneeRole - Role of the user being assigned the task
   * @returns true if assignment is allowed, false otherwise
   */
  static canAssignTo(assignerRole: Role, assigneeRole: Role): boolean {
    const allowedRoles = this.ROLE_HIERARCHY[assignerRole]
    return allowedRoles?.includes(assigneeRole) || false
  }

  /**
   * Get list of users that the current user can assign tasks to
   * @param currentUser - The user who wants to assign tasks
   * @param allUsers - All available users in the system
   * @returns Filtered list of users that can be assigned tasks
   */
  static getAssignableUsers(currentUser: User, allUsers: User[]): User[] {
    return allUsers.filter(user => 
      this.canAssignTo(currentUser.role, user.role) && 
      user.id !== currentUser.id &&
      user.isActive
    )
  }

  /**
   * Check if a user can view a specific task
   * @param user - User requesting access
   * @param task - Task being accessed
   * @returns true if user can view the task
   */
  static canViewTask(user: User, task: { createdById: string; assignedToId: string }): boolean {
    // Users can view tasks they created or are assigned to
    if (user.id === task.createdById || user.id === task.assignedToId) {
      return true
    }

    // Admins can view all tasks
    if (user.role === 'ADMIN') {
      return true
    }

    return false
  }

  /**
   * Check if a user can edit a specific task
   * @param user - User requesting edit access
   * @param task - Task being edited
   * @returns true if user can edit the task
   */
  static canEditTask(user: User, task: { createdById: string; assignedToId: string }): boolean {
    // Task creators can always edit their tasks
    if (user.id === task.createdById) {
      return true
    }

    // Admins can edit all tasks
    if (user.role === 'ADMIN') {
      return true
    }

    return false
  }

  /**
   * Check if a user can update task status
   * @param user - User requesting status update
   * @param task - Task being updated
   * @returns true if user can update status
   */
  static canUpdateTaskStatus(user: User, task: { createdById: string; assignedToId: string }): boolean {
    // Assigned users can update status of their tasks
    if (user.id === task.assignedToId) {
      return true
    }

    // Task creators can update status
    if (user.id === task.createdById) {
      return true
    }

    // Admins can update any task status
    if (user.role === 'ADMIN') {
      return true
    }

    return false
  }

  /**
   * Check if a user can delete a task
   * @param user - User requesting delete access
   * @param task - Task being deleted
   * @returns true if user can delete the task
   */
  static canDeleteTask(user: User, task: { createdById: string }): boolean {
    // Only task creators and admins can delete tasks
    return user.id === task.createdById || user.role === 'ADMIN'
  }

  /**
   * Check if a user can create task templates
   * @param user - User requesting template creation
   * @returns true if user can create templates
   */
  static canCreateTemplates(user: User): boolean {
    // All users except partners can create templates
    return user.role !== 'PARTNER'
  }

  /**
   * Check if a user can create recurring tasks
   * @param user - User requesting recurring task creation
   * @returns true if user can create recurring tasks
   */
  static canCreateRecurringTasks(user: User): boolean {
    // Only admins and editors can create recurring tasks
    return user.role === 'ADMIN' || user.role === 'EDITOR'
  }

  /**
   * Get role display name
   * @param role - User role
   * @returns Human-readable role name
   */
  static getRoleDisplayName(role: Role): string {
    const roleNames: Record<Role, string> = {
      ADMIN: 'Administrator',
      EDITOR: 'Editor',
      VIEWER: 'Viewer',
      PARTNER: 'Partner'
    }
    return roleNames[role]
  }

  /**
   * Get role hierarchy level (higher number = higher role)
   * @param role - User role
   * @returns Numeric hierarchy level
   */
  static getRoleLevel(role: Role): number {
    const roleLevels: Record<Role, number> = {
      PARTNER: 1,
      VIEWER: 2,
      EDITOR: 3,
      ADMIN: 4
    }
    return roleLevels[role]
  }

  /**
   * Sort users by role hierarchy (highest roles first)
   * @param users - Array of users to sort
   * @returns Sorted array of users
   */
  static sortUsersByRole(users: User[]): User[] {
    return users.sort((a, b) => this.getRoleLevel(b.role) - this.getRoleLevel(a.role))
  }

  /**
   * Filter tasks based on user permissions
   * @param user - Current user
   * @param tasks - Array of tasks to filter
   * @returns Filtered tasks that user can access
   */
  static filterTasksByPermissions(
    user: User, 
    tasks: Array<{ createdById: string; assignedToId: string }>
  ): Array<{ createdById: string; assignedToId: string }> {
    return tasks.filter(task => this.canViewTask(user, task))
  }

  /**
   * Validate task assignment
   * @param assignerRole - Role of user creating the task
   * @param assigneeRole - Role of user being assigned
   * @throws Error if assignment is not allowed
   */
  static validateTaskAssignment(assignerRole: Role, assigneeRole: Role): void {
    if (!this.canAssignTo(assignerRole, assigneeRole)) {
      throw new Error(
        `Users with role ${assignerRole} cannot assign tasks to users with role ${assigneeRole}`
      )
    }
  }
}