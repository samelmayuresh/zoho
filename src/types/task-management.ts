// Task Management System Types

export type TaskManagementStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD'
export type TaskManagementPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
export type TaskRecurrenceType = 'DAILY' | 'WEEKLY' | 'MONTHLY'

export interface TaskManagement {
  id: string
  title: string
  description?: string
  status: TaskManagementStatus
  priority: TaskManagementPriority
  dueDate?: Date
  completedAt?: Date
  completionNote?: string
  createdById: string
  assignedToId: string
  createdAt: Date
  updatedAt: Date
  
  // Relations
  createdBy: {
    id: string
    firstName?: string
    lastName?: string
    email: string
  }
  assignedTo: {
    id: string
    firstName?: string
    lastName?: string
    email: string
  }
  comments: TaskManagementComment[]
}

export interface TaskManagementComment {
  id: string
  taskId: string
  userId: string
  comment: string
  createdAt: Date
  
  // Relations
  user: {
    id: string
    firstName?: string
    lastName?: string
    email: string
  }
}

export interface TaskManagementTemplate {
  id: string
  name: string
  title: string
  description?: string
  priority: TaskManagementPriority
  estimatedHours?: number
  createdById: string
  createdAt: Date
  
  // Relations
  createdBy: {
    id: string
    firstName?: string
    lastName?: string
    email: string
  }
}

export interface RecurringTaskManagement {
  id: string
  templateId: string
  recurrenceType: TaskRecurrenceType
  recurrenceInterval: number
  nextDueDate: Date
  assignedToId: string
  createdById: string
  isActive: boolean
  createdAt: Date
  
  // Relations
  template: TaskManagementTemplate
  assignedTo: {
    id: string
    firstName?: string
    lastName?: string
    email: string
  }
  createdBy: {
    id: string
    firstName?: string
    lastName?: string
    email: string
  }
}

// API Request/Response Types
export interface CreateTaskManagementData {
  title: string
  description?: string
  priority: TaskManagementPriority
  dueDate?: Date
  assignedToId: string
  templateId?: string
}

export interface UpdateTaskManagementData {
  title?: string
  description?: string
  priority?: TaskManagementPriority
  dueDate?: Date
  assignedToId?: string
  status?: TaskManagementStatus
  completionNote?: string
}

export interface TaskManagementFilters {
  status?: TaskManagementStatus[]
  priority?: TaskManagementPriority[]
  assignedTo?: string[]
  createdBy?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
  search?: string
  overdue?: boolean
}

export interface TaskManagementAnalytics {
  totalTasks: number
  completedTasks: number
  overdueTasks: number
  averageCompletionTime: number
  tasksByStatus: Record<TaskManagementStatus, number>
  tasksByPriority: Record<TaskManagementPriority, number>
  completionRate: number
  onTimeCompletionRate: number
}

export interface CreateTaskTemplateData {
  name: string
  title: string
  description?: string
  priority: TaskManagementPriority
  estimatedHours?: number
}

export interface CreateRecurringTaskData {
  templateId: string
  recurrenceType: TaskRecurrenceType
  recurrenceInterval: number
  nextDueDate: Date
  assignedToId: string
}

export interface TaskManagementError {
  code: string
  message: string
  field?: string
}

// Common error codes
export const TASK_MANAGEMENT_ERRORS = {
  INVALID_ASSIGNEE: 'Cannot assign task to user at same or higher level',
  TASK_NOT_FOUND: 'Task not found or access denied',
  INVALID_STATUS_TRANSITION: 'Invalid status transition',
  MISSING_COMPLETION_NOTE: 'Completion note required when marking task complete',
  TEMPLATE_NOT_FOUND: 'Task template not found',
  UNAUTHORIZED: 'Insufficient permissions for this operation',
  INVALID_DUE_DATE: 'Due date must be in the future',
  INVALID_RECURRENCE: 'Invalid recurrence configuration'
} as const

// Status transition validation
export const VALID_STATUS_TRANSITIONS: Record<TaskManagementStatus, TaskManagementStatus[]> = {
  NOT_STARTED: ['IN_PROGRESS', 'ON_HOLD'],
  IN_PROGRESS: ['COMPLETED', 'ON_HOLD', 'NOT_STARTED'],
  ON_HOLD: ['IN_PROGRESS', 'NOT_STARTED'],
  COMPLETED: [] // Cannot transition from completed
}

// Priority levels for sorting
export const PRIORITY_LEVELS: Record<TaskManagementPriority, number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  URGENT: 4
}

// Status colors for UI
export const STATUS_COLORS: Record<TaskManagementStatus, string> = {
  NOT_STARTED: 'gray',
  IN_PROGRESS: 'blue',
  COMPLETED: 'green',
  ON_HOLD: 'yellow'
}

// Priority colors for UI
export const PRIORITY_COLORS: Record<TaskManagementPriority, string> = {
  LOW: 'gray',
  MEDIUM: 'blue',
  HIGH: 'orange',
  URGENT: 'red'
}