import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { PrismaClient } from '@prisma/client'
import { TaskHierarchyService } from '@/lib/task-hierarchy'
import { 
  TaskManagementStatus,
  TASK_MANAGEMENT_ERRORS,
  VALID_STATUS_TRANSITIONS 
} from '@/types/task-management'

const prisma = new PrismaClient()

// PUT /api/task-management/[id]/status - Update task status
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('crm-session')

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionData = JSON.parse(sessionCookie.value)
    const { id: taskId } = await params
    const { status, completionNote } = await request.json()

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 })
    }

    // Get existing task
    const existingTask = await prisma.taskManagement.findUnique({
      where: { id: taskId }
    })

    if (!existingTask) {
      return NextResponse.json({ error: TASK_MANAGEMENT_ERRORS.TASK_NOT_FOUND }, { status: 404 })
    }

    // Check permissions
    const currentUser = { id: sessionData.userId, role: sessionData.role }
    if (!TaskHierarchyService.canUpdateTaskStatus(currentUser, existingTask)) {
      return NextResponse.json({ error: TASK_MANAGEMENT_ERRORS.UNAUTHORIZED }, { status: 403 })
    }

    // Validate status transition
    if (status !== existingTask.status) {
      const validTransitions = VALID_STATUS_TRANSITIONS[existingTask.status]
      if (!validTransitions.includes(status)) {
        return NextResponse.json(
          { error: TASK_MANAGEMENT_ERRORS.INVALID_STATUS_TRANSITION },
          { status: 400 }
        )
      }

      // Require completion note when marking as completed
      if (status === 'COMPLETED' && !completionNote) {
        return NextResponse.json(
          { error: TASK_MANAGEMENT_ERRORS.MISSING_COMPLETION_NOTE },
          { status: 400 }
        )
      }
    }

    // Prepare update data
    const updateData: any = {
      status,
      updatedAt: new Date()
    }

    // Set completion timestamp and note if marking as completed
    if (status === 'COMPLETED') {
      updateData.completedAt = new Date()
      updateData.completionNote = completionNote
    }

    // Update task status
    const task = await prisma.taskManagement.update({
      where: { id: taskId },
      data: updateData,
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
          orderBy: { createdAt: 'desc' },
          take: 3
        }
      }
    })

    // TODO: Send notification for status updates
    // await sendTaskStatusUpdateNotification(task, existingTask.status)

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error updating task status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}