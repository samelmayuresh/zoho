import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { PrismaClient } from '@prisma/client'
import { TaskHierarchyService } from '@/lib/task-hierarchy'
import { 
  UpdateTaskManagementData,
  TASK_MANAGEMENT_ERRORS,
  VALID_STATUS_TRANSITIONS 
} from '@/types/task-management'

const prisma = new PrismaClient()

// GET /api/task-management/[id] - Get single task
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('crm-session')

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionData = JSON.parse(sessionCookie.value)
    const { id: taskId } = await params

    const task = await prisma.taskManagement.findUnique({
      where: { id: taskId },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        assignedTo: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        comments: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!task) {
      return NextResponse.json({ error: TASK_MANAGEMENT_ERRORS.TASK_NOT_FOUND }, { status: 404 })
    }

    // Check permissions
    const currentUser = { id: sessionData.userId, role: sessionData.role }
    if (!TaskHierarchyService.canViewTask(currentUser, task)) {
      return NextResponse.json({ error: TASK_MANAGEMENT_ERRORS.UNAUTHORIZED }, { status: 403 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error fetching task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/task-management/[id] - Update task
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('crm-session')

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionData = JSON.parse(sessionCookie.value)
    const { id: taskId } = await params
    const updateData: UpdateTaskManagementData = await request.json()

    // Get existing task
    const existingTask = await prisma.taskManagement.findUnique({
      where: { id: taskId }
    })

    if (!existingTask) {
      return NextResponse.json({ error: TASK_MANAGEMENT_ERRORS.TASK_NOT_FOUND }, { status: 404 })
    }

    // Check permissions
    const currentUser = { id: sessionData.userId, role: sessionData.role }
    if (!TaskHierarchyService.canEditTask(currentUser, existingTask)) {
      return NextResponse.json({ error: TASK_MANAGEMENT_ERRORS.UNAUTHORIZED }, { status: 403 })
    }

    // Validate status transition if status is being updated
    if (updateData.status && updateData.status !== existingTask.status) {
      const validTransitions = VALID_STATUS_TRANSITIONS[existingTask.status]
      if (!validTransitions.includes(updateData.status)) {
        return NextResponse.json(
          { error: TASK_MANAGEMENT_ERRORS.INVALID_STATUS_TRANSITION },
          { status: 400 }
        )
      }

      // Require completion note when marking as completed
      if (updateData.status === 'COMPLETED' && !updateData.completionNote) {
        return NextResponse.json(
          { error: TASK_MANAGEMENT_ERRORS.MISSING_COMPLETION_NOTE },
          { status: 400 }
        )
      }
    }

    // Validate assignee change if provided
    if (updateData.assignedToId && updateData.assignedToId !== existingTask.assignedToId) {
      const assignee = await prisma.user.findUnique({
        where: { id: updateData.assignedToId },
        select: { id: true, role: true, isActive: true }
      })

      if (!assignee) {
        return NextResponse.json({ error: 'Assigned user not found' }, { status: 404 })
      }

      if (!assignee.isActive) {
        return NextResponse.json(
          { error: 'Cannot assign task to inactive user' },
          { status: 400 }
        )
      }

      try {
        TaskHierarchyService.validateTaskAssignment(sessionData.role, assignee.role)
      } catch (hierarchyError) {
        return NextResponse.json(
          { error: TASK_MANAGEMENT_ERRORS.INVALID_ASSIGNEE },
          { status: 403 }
        )
      }
    }

    // Validate due date
    if (updateData.dueDate && new Date(updateData.dueDate) <= new Date()) {
      return NextResponse.json(
        { error: TASK_MANAGEMENT_ERRORS.INVALID_DUE_DATE },
        { status: 400 }
      )
    }

    // Prepare update data
    const updatePayload: any = {
      ...updateData,
      updatedAt: new Date()
    }

    // Set completion timestamp if marking as completed
    if (updateData.status === 'COMPLETED') {
      updatePayload.completedAt = new Date()
    }

    // Convert date strings to Date objects
    if (updateData.dueDate) {
      updatePayload.dueDate = new Date(updateData.dueDate)
    }

    // Update task
    const task = await prisma.taskManagement.update({
      where: { id: taskId },
      data: updatePayload,
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        assignedTo: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        comments: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    // TODO: Send notification for status updates
    // if (updateData.status) {
    //   await sendTaskStatusUpdateNotification(task, existingTask.status)
    // }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/task-management/[id] - Delete task
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('crm-session')

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionData = JSON.parse(sessionCookie.value)
    const { id: taskId } = await params

    // Get existing task
    const existingTask = await prisma.taskManagement.findUnique({
      where: { id: taskId }
    })

    if (!existingTask) {
      return NextResponse.json({ error: TASK_MANAGEMENT_ERRORS.TASK_NOT_FOUND }, { status: 404 })
    }

    // Check permissions
    const currentUser = { id: sessionData.userId, role: sessionData.role }
    if (!TaskHierarchyService.canDeleteTask(currentUser, existingTask)) {
      return NextResponse.json({ error: TASK_MANAGEMENT_ERRORS.UNAUTHORIZED }, { status: 403 })
    }

    // Delete task (comments will be cascade deleted)
    await prisma.taskManagement.delete({
      where: { id: taskId }
    })

    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}