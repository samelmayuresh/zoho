'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { TaskHierarchyService } from '@/lib/task-hierarchy'
import { 
  CreateTaskManagementData, 
  TaskManagementPriority,
  TaskManagement 
} from '@/types/task-management'

interface User {
  id: string
  firstName?: string
  lastName?: string
  email: string
  role: any
  isActive: boolean
}

interface TaskFormProps {
  onSubmit: (taskData: CreateTaskManagementData) => Promise<void>
  onCancel: () => void
  availableAssignees: User[]
  editingTask?: TaskManagement
  loading?: boolean
}

export default function TaskForm({ 
  onSubmit, 
  onCancel, 
  availableAssignees, 
  editingTask,
  loading 
}: TaskFormProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState<CreateTaskManagementData>({
    title: '',
    description: '',
    priority: 'MEDIUM' as TaskManagementPriority,
    dueDate: undefined,
    assignedToId: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description || '',
        priority: editingTask.priority,
        dueDate: editingTask.dueDate ? new Date(editingTask.dueDate) : undefined,
        assignedToId: editingTask.assignedToId
      })
    }
  }, [editingTask])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.assignedToId) return

    setSubmitting(true)
    try {
      await onSubmit(formData)
      if (!editingTask) {
        // Reset form for new tasks
        setFormData({
          title: '',
          description: '',
          priority: 'MEDIUM',
          dueDate: undefined,
          assignedToId: ''
        })
      }
    } catch (error) {
      console.error('Error submitting task:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData(prev => ({
      ...prev,
      dueDate: value ? new Date(value) : undefined
    }))
  }

  const formatDateForInput = (date?: Date) => {
    if (!date) return ''
    return date.toISOString().split('T')[0]
  }

  const filteredAssignees = user ? 
    TaskHierarchyService.getAssignableUsers(user, availableAssignees) : 
    availableAssignees

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {editingTask ? 'Edit Task' : 'Create New Task'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <span className="sr-only">Close</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Task Title *
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter task title..."
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter task description..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-2">
              Assign To *
            </label>
            <select
              id="assignedTo"
              required
              value={formData.assignedToId}
              onChange={(e) => setFormData(prev => ({ ...prev, assignedToId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select assignee...</option>
              {filteredAssignees.map((assignee) => (
                <option key={assignee.id} value={assignee.id}>
                  {assignee.firstName} {assignee.lastName} ({assignee.email})
                </option>
              ))}
            </select>
            {filteredAssignees.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">
                No users available to assign tasks to.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as TaskManagementPriority }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            value={formatDateForInput(formData.dueDate)}
            onChange={handleDateChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !formData.title.trim() || !formData.assignedToId}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>{editingTask ? 'Updating...' : 'Creating...'}</span>
              </div>
            ) : (
              editingTask ? 'Update Task' : 'Create Task'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}