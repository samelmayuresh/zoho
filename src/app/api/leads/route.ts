import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { PrismaClient } from '@prisma/client'
import { CreateLeadData, LeadFilters, LeadListResponse } from '@/types/lead'
import { updateLeadScoreAndRating } from '@/lib/lead-scoring'

const prisma = new PrismaClient()

// GET /api/leads - List leads with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('crm-session')

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionData = JSON.parse(sessionCookie.value)
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')?.split(',') || []
    const source = searchParams.get('source')?.split(',') || []
    const assigneeId = searchParams.get('assigneeId') || ''

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status.length > 0) {
      where.status = { in: status }
    }

    if (source.length > 0) {
      where.source = { in: source }
    }

    if (assigneeId) {
      where.assignedToId = assigneeId
    }

    // Role-based filtering
    if (sessionData.role === 'VIEWER' || sessionData.role === 'EDITOR') {
      where.OR = [
        { assignedToId: sessionData.userId },
        { createdById: sessionData.userId }
      ]
    }

    const skip = (page - 1) * limit

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: {
          assignedTo: {
            select: { id: true, firstName: true, lastName: true, email: true }
          },
          createdBy: {
            select: { id: true, firstName: true, lastName: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.lead.count({ where })
    ])

    const response: LeadListResponse = {
      leads,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/leads - Create new lead
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('crm-session')

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionData = JSON.parse(sessionCookie.value)
    
    // Check permissions
    if (!['ADMIN', 'EDITOR'].includes(sessionData.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const leadData: CreateLeadData = await request.json()

    // Validate required fields
    if (!leadData.firstName || !leadData.lastName) {
      return NextResponse.json({ error: 'First name and last name are required' }, { status: 400 })
    }

    // Calculate score and rating
    const { score, rating } = updateLeadScoreAndRating(leadData)

    // Create lead
    const lead = await prisma.lead.create({
      data: {
        ...leadData,
        score,
        rating,
        createdById: sessionData.userId,
        tags: leadData.tags || []
      },
      include: {
        assignedTo: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        createdBy: {
          select: { id: true, firstName: true, lastName: true, email: true }
        }
      }
    })

    return NextResponse.json(lead, { status: 201 })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}