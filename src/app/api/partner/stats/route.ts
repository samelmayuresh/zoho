import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // For demo purposes, return mock data
    // In production, you'd get the current partner user ID from session/auth
    const mockPartnerId = 1

    const myLeads = await prisma.lead.count({
      where: { createdById: mockPartnerId }
    }).catch(() => 8)

    const assignedLeads = await prisma.lead.count({
      where: { assignedToId: mockPartnerId }
    }).catch(() => 12)

    const convertedLeads = await prisma.lead.count({
      where: { 
        createdById: mockPartnerId,
        status: 'CONVERTED'
      }
    }).catch(() => 3)

    const pendingTasks = await prisma.task.count({
      where: { 
        assignedToId: mockPartnerId,
        status: { not: 'COMPLETED' }
      }
    }).catch(() => 5)

    return NextResponse.json({
      myLeads,
      assignedLeads,
      convertedLeads,
      pendingTasks
    })

  } catch (error) {
    console.error('Error fetching partner stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}