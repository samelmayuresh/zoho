import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { PrismaClient } from '@prisma/client'
import { TaskHierarchyService } from '@/lib/task-hierarchy'
import { 
  CreateTaskManagementData, 
  TaskManagementFilters,
  TASK_MANAGEMENT_ERRORS 
} from '@/types/task-management'

const prisma = new PrismaClient()

// GET /api/task-management - List tasks with filtering
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('crm-session')

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionData = JSON.parse(sessionCookie.value)
    const { searchParams } = new URL(request.url)
    
    // Parse filters from query parameters
    const filters: TaskManagementFilters = {
      status: searchParams.get('status')?.split(',') as any,
      priority: searchParams.get('priority')?.split(',') as any,
      assignedTo: searchParams.get('assignedTo')?.split(','),
      createdBy: searchParams.get('createdBy')?.split(','),
      search: searchParams.get('search') || undefined,
      overdue: searchParams.get('overdue') === 'true'
    }

    // Date range filter
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    if (startDate && endDate) {
      filters.dateRange = {
        start: new Date(startDate),
        end: new Date(endDate)
      }
    }

    // Build where clause
    const where: any = {}

    // Role-based filtering
    if (sessionData.role !== 'ADMIN') {
      where.OR = [
        { createdById: sessionData.userId },
        { assignedToId: sessionData.userId }
      ]
    }

    // Apply filters
    if (filters.status?.length) {
      where.status = { in: filters.status }
    }

    if (filters.priority?.length) {
      where.priority = { in: filters.priority }
    }

    if (filters.assignedTo?.length) {
      where.assignedToId = { in: filters.assignedTo }
    }

    if (filters.createdBy?.length) {
      where.createdById = { in: filters.createdBy }
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ]
    }

    if (filters.overdue) {
      where.dueDate = { lt: new Date() }
      where.status = { not: 'COMPLETED' }
    }

    if (filters.dateRange) {
      where.createdAt = {
        gte: filters.dateRange.start,
        lte: filters.dateRange.end
      }
    }

    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const [tasks, total] = await Promise.all([
      prisma.taskManagement.findMany({
        where,
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
            take: 3 // Only latest 3 comments in list view
          }
        },
        orderBy: [
          { status: 'asc' },
          { priority: 'desc' },
          { dueDate: 'asc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.taskManagement.count({ where })
    ])

    return NextResponse.json({
      tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/task-management - Create new task
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('crm-session')

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionData = JSON.parse(sessionCookie.value)
    const taskData: CreateTaskManagementData = await request.json()

    // Validate required fields
    if (!taskData.title || !taskData.assignedToId) {
      return NextResponse.json(
        { error: 'Title and assignedToId are required' },
        { status: 400 }
      )
    }

    // Get assignee to validate hierarchy
    const assignee = await prisma.user.findUnique({
      where: { id: taskData.assignedToId },
      select: { id: true, role: true, isActive: true }
    })

    if (!assignee) {
      return NextResponse.json(
        { error: 'Assigned user not found' },
        { status: 404 }
      )
    }

    if (!assignee.isActive) {
      return NextResponse.json(
        { error: 'Cannot assign task to inactive user' },
        { status: 400 }
      )
    }

    // Validate hierarchy
    try {
      TaskHierarchyService.validateTaskAssignment(sessionData.role, assignee.role)
    } catch (hierarchyError) {
      return NextResponse.json(
        { error: TASK_MANAGEMENT_ERRORS.INVALID_ASSIGNEE },
        { status: 403 }
      )
    }

    // Validate due date
    if (taskData.dueDate && new Date(taskData.dueDate) <= new Date()) {
      return NextResponse.json(
        { error: TASK_MANAGEMENT_ERRORS.INVALID_DUE_DATE },
        { status: 400 }
      )
    }

    // Create task
    const task = await prisma.taskManagement.create({
      data: {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
        createdById: sessionData.userId,
        assignedToId: taskData.assignedToId
      },
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
          }
        }
      }
    })

    // TODO: Send notification to assigned user
    // await sendTaskAssignmentNotification(task)

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}