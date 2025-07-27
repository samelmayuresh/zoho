'use client'

import { useState } from 'react'
import { 
  TaskManagement, 
  TaskManagementStatus, 
  TaskManagementPriority,
  STATUS_COLORS,
  PRIORITY_COLORS 
} from '@/types/task-management'

interface TaskListProps {
  tasks: TaskManagement[]
  onStatusUpdate: (taskId: string, status: TaskManagementStatus, note?: string) => void
  onTaskSelect: (task: TaskManagement) => void
  loading?: boolean
}

export default function TaskList({ tasks, onStatusUpdate, onTaskSelect, loading }: TaskListProps) {
  const [updatingTasks, setUpdatingTasks] = useState<Set<string>>(new Set())

  const handleStatusUpdate = async (taskId: string, newStatus: TaskManagementStatus) => {
    if (newStatus === 'COMPLETED') {
      const note = prompt('Please provide a completion note:')
      if (!note) return
      
      setUpdatingTasks(prev => new Set(prev).add(taskId))
      await onStatusUpdate(taskId, newStatus, note)
      setUpdatingTasks(prev => {
        const next = new Set(prev)
        next.delete(taskId)
        return next
      })
    } else {
      setUpdatingTasks(prev => new Set(prev).add(taskId))
      await onStatusUpdate(taskId, newStatus)
      setUpdatingTasks(prev => {
        const next = new Set(prev)
        next.delete(taskId)
        return next
      })
    }
  }

  const getStatusColor = (status: TaskManagementStatus) => {
    const colors = {
      NOT_STARTED: 'bg-gray-100 text-gray-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      ON_HOLD: 'bg-yellow-100 text-yellow-800'
    }
    return colors[status]
  }

  const getPriorityColor = (priority: TaskManagementPriority) => {
    const colors = {
      LOW: 'bg-gray-100 text-gray-600',
      MEDIUM: 'bg-blue-100 text-blue-600',
      HIGH: 'bg-orange-100 text-orange-600',
      URGENT: 'bg-red-100 text-red-600'
    }
    return colors[priority]
  }

  const isOverdue = (task: TaskManagement) => {
    return task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED'
  }

  const getStatusOptions = (currentStatus: TaskManagementStatus) => {
    const transitions = {
      NOT_STARTED: ['IN_PROGRESS', 'ON_HOLD'],
      IN_PROGRESS: ['COMPLETED', 'ON_HOLD', 'NOT_STARTED'],
      ON_HOLD: ['IN_PROGRESS', 'NOT_STARTED'],
      COMPLETED: []
    }
    return transitions[currentStatus] || []
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📋</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
        <p className="text-gray-500">Create your first task to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`bg-white rounded-lg shadow-sm border-l-4 p-4 hover:shadow-md transition-shadow cursor-pointer ${
            isOverdue(task) ? 'border-l-red-500 bg-red-50' : 'border-l-blue-500'
          }`}
          onClick={() => onTaskSelect(task)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {task.title}
                </h3>
                {isOverdue(task) && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Overdue
                  </span>
                )}
              </div>
              
              {task.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {task.description}
                </p>
              )}

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <span>👤</span>
                  <span>
                    {task.assignedTo.firstName} {task.assignedTo.lastName}
                  </span>
                </div>
                
                {task.dueDate && (
                  <div className="flex items-center space-x-1">
                    <span>📅</span>
                    <span>
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                )}

                <div className="flex items-center space-x-1">
                  <span>💬</span>
                  <span>{task.comments.length}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2 ml-4">
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                
                <div className="relative">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusUpdate(task.id, e.target.value as TaskManagementStatus)}
                    disabled={updatingTasks.has(task.id)}
                    className={`text-xs font-medium px-2 py-1 rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(task.status)}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value={task.status}>
                      {task.status.replace('_', ' ')}
                    </option>
                    {getStatusOptions(task.status).map((status) => (
                      <option key={status} value={status}>
                        {status.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                  
                  {updatingTasks.has(task.id) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-xs text-gray-400">
                Created by {task.createdBy.firstName} {task.createdBy.lastName}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}