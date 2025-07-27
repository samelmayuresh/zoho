'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import TaskList from '@/components/task-management/TaskList'
import TaskForm from '@/components/task-management/TaskForm'
import { 
  TaskManagement, 
  TaskManagementStatus, 
  CreateTaskManagementData,
  TaskManagementFilters 
} from '@/types/task-management'

interface User {
  id: string
  firstName?: string
  lastName?: string
  email: string
  role: any
  isActive: boolean
}

export default function TasksPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<TaskManagement[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedTask, setSelectedTask] = useState<TaskManagement | null>(null)
  const [filters, setFilters] = useState<TaskManagementFilters>({})

  useEffect(() => {
    fetchTasks()
    fetchUsers()
  }, [])

  const fetchTasks = async () => {
    try {
      const queryParams = new URLSearchParams()
      
      if (filters.status?.length) {
        queryParams.append('status', filters.status.join(','))
      }
      if (filters.priority?.length) {
        queryParams.append('priority', filters.priority.join(','))
      }
      if (filters.search) {
        queryParams.append('search', filters.search)
      }
      if (filters.overdue) {
        queryParams.append('overdue', 'true')
      }

      const response = await fetch(`/api/task-management?${queryParams}`)
      if (response.ok) {
        const data = await response.json()
        setTasks(data.tasks || [])
      } else {
        console.error('Failed to fetch tasks')
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.data?.data || [])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleCreateTask = async (taskData: CreateTaskManagementData) => {
    try {
      const response = await fetch('/api/task-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })

      if (response.ok) {
        const newTask = await response.json()
        setTasks(prev => [newTask, ...prev])
        setShowCreateForm(false)
      } else {
        const error = await response.json()
        alert(`Error creating task: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating task:', error)
      alert('Error creating task')
    }
  }

  const handleStatusUpdate = async (taskId: string, status: TaskManagementStatus, note?: string) => {
    try {
      const response = await fetch(`/api/task-management/${taskId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, completionNote: note }),
      })

      if (response.ok) {
        const updatedTask = await response.json()
        setTasks(prev => prev.map(task => 
          task.id === taskId ? updatedTask : task
        ))
      } else {
        const error = await response.json()
        alert(`Error updating task: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating task status:', error)
      alert('Error updating task status')
    }
  }

  const handleTaskSelect = (task: TaskManagement) => {
    setSelectedTask(task)
    // TODO: Open task detail modal or navigate to detail page
    console.log('Selected task:', task)
  }

  const canCreateTasks = user && user.role !== 'PARTNER'

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
              <p className="text-gray-600 mt-1">
                Manage and track your assigned tasks
              </p>
            </div>
            
            {canCreateTasks && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center space-x-2"
              >
                <span>➕</span>
                <span>Create Task</span>
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={filters.search || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status?.[0] || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    status: e.target.value ? [e.target.value as TaskManagementStatus] : undefined 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="NOT_STARTED">Not Started</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ON_HOLD">On Hold</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={filters.priority?.[0] || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    priority: e.target.value ? [e.target.value as any] : undefined 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Priority</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={fetchTasks}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.overdue || false}
                  onChange={(e) => setFilters(prev => ({ ...prev, overdue: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Show only overdue tasks</span>
              </label>
            </div>
          </div>

          {/* Task Creation Form */}
          {showCreateForm && (
            <div className="mb-6">
              <TaskForm
                onSubmit={handleCreateTask}
                onCancel={() => setShowCreateForm(false)}
                availableAssignees={users}
              />
            </div>
          )}

          {/* Task List */}
          <TaskList
            tasks={tasks}
            onStatusUpdate={handleStatusUpdate}
            onTaskSelect={handleTaskSelect}
            loading={loading}
          />

          {/* Task Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">
                {tasks.length}
              </div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-yellow-600">
                {tasks.filter(t => t.status === 'IN_PROGRESS').length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-green-600">
                {tasks.filter(t => t.status === 'COMPLETED').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-red-600">
                {tasks.filter(t => 
                  t.dueDate && 
                  new Date(t.dueDate) < new Date() && 
                  t.status !== 'COMPLETED'
                ).length}
              </div>
              <div className="text-sm text-gray-600">Overdue</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}