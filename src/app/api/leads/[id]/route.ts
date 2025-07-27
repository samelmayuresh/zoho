import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { PrismaClient } from '@prisma/client'
import { UpdateLeadData } from '@/types/lead'
import { updateLeadScoreAndRating } from '@/lib/lead-scoring'

const prisma = new PrismaClient()

// GET /api/leads/[id] - Get single lead
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('crm-session')

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionData = JSON.parse(sessionCookie.value)
    const leadId = params.id

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        assignedTo: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        createdBy: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        activities: {
          include: {
            createdBy: {
              select: { id: true, firstName: true, lastName: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // Role-based access control
    if (sessionData.role === 'VIEWER' || sessionData.role === 'EDITOR') {
      if (lead.assignedToId !== sessionData.userId && lead.createdById !== sessionData.userId) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    }

    return NextResponse.json(lead)
  } catch (error) {
    console.error('Error fetching lead:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/leads/[id] - Update lead
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('crm-session')

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionData = JSON.parse(sessionCookie.value)
    const leadId = params.id

    // Check permissions
    if (!['ADMIN', 'EDITOR'].includes(sessionData.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const updateData: UpdateLeadData = await request.json()

    // Get existing lead for access control
    const existingLead = await prisma.lead.findUnique({
      where: { id: leadId }
    })

    if (!existingLead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // Role-based access control
    if (sessionData.role === 'EDITOR') {
      if (existingLead.assignedToId !== sessionData.userId && existingLead.createdById !== sessionData.userId) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    }

    // Calculate new score and rating if relevant fields changed
    let scoreUpdate = {}
    if (updateData.email !== undefined || updateData.phone !== undefined || 
        updateData.company !== undefined || updateData.jobTitle !== undefined || 
        updateData.source !== undefined) {
      const leadForScoring = { ...existingLead, ...updateData }
      const { score, rating } = updateLeadScoreAndRating(leadForScoring)
      scoreUpdate = { score, rating }
    }

    // Update lead
    const lead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        ...updateData,
        ...scoreUpdate
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

    return NextResponse.json(lead)
  } catch (error) {
    console.error('Error updating lead:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/leads/[id] - Delete lead
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('crm-session')

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionData = JSON.parse(sessionCookie.value)
    const leadId = params.id

    // Only ADMIN can delete leads
    if (sessionData.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const lead = await prisma.lead.findUnique({
      where: { id: leadId }
    })

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    await prisma.lead.delete({
      where: { id: leadId }
    })

    return NextResponse.json({ message: 'Lead deleted successfully' })
  } catch (error) {
    console.error('Error deleting lead:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}