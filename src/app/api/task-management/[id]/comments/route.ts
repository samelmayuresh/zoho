import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { PrismaClient } from '@prisma/client'
import { TaskHierarchyService } from '@/lib/task-hierarchy'
import { TASK_MANAGEMENT_ERRORS } from '@/types/task-management'

const prisma = new PrismaClient()

// GET /api/task-management/[id]/comments - Get task comments
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('crm-session')

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionData = JSON.parse(sessionCookie.value)
    const { id: taskId } = await params

    // Check if task exists and user can view it
    const task = await prisma.taskManagement.findUnique({
      where: { id: taskId },
      select: { id: true, createdById: true, assignedToId: true }
    })

    if (!task) {
      return NextResponse.json({ error: TASK_MANAGEMENT_ERRORS.TASK_NOT_FOUND }, { status: 404 })
    }

    const currentUser = { id: sessionData.userId, role: sessionData.role }
    if (!TaskHierarchyService.canViewTask(currentUser, task)) {
      return NextResponse.json({ error: TASK_MANAGEMENT_ERRORS.UNAUTHORIZED }, { status: 403 })
    }

    // Get pagination parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const [comments, total] = await Promise.all([
      prisma.taskManagementComment.findMany({
        where: { taskId },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.taskManagementComment.count({ where: { taskId } })
    ])

    return NextResponse.json({
      comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching task comments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/task-management/[id]/comments - Add comment to task
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('crm-session')

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionData = JSON.parse(sessionCookie.value)
    const { id: taskId } = await params
    const { comment } = await request.json()

    if (!comment || comment.trim().length === 0) {
      return NextResponse.json({ error: 'Comment cannot be empty' }, { status: 400 })
    }

    if (comment.length > 2000) {
      return NextResponse.json({ error: 'Comment too long (max 2000 characters)' }, { status: 400 })
    }

    // Check if task exists and user can view it
    const task = await prisma.taskManagement.findUnique({
      where: { id: taskId },
      select: { id: true, createdById: true, assignedToId: true }
    })

    if (!task) {
      return NextResponse.json({ error: TASK_MANAGEMENT_ERRORS.TASK_NOT_FOUND }, { status: 404 })
    }

    const currentUser = { id: sessionData.userId, role: sessionData.role }
    if (!TaskHierarchyService.canViewTask(currentUser, task)) {
      return NextResponse.json({ error: TASK_MANAGEMENT_ERRORS.UNAUTHORIZED }, { status: 403 })
    }

    // Create comment
    const newComment = await prisma.taskManagementComment.create({
      data: {
        taskId,
        userId: sessionData.userId,
        comment: comment.trim()
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true }
        }
      }
    })

    // TODO: Send notification to relevant parties
    // await sendTaskCommentNotification(task, newComment)

    return NextResponse.json(newComment, { status: 201 })
  } catch (error) {
    console.error('Error creating task comment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}