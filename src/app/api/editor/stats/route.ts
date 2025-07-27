import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // For demo purposes, return mock data
    // In production, you'd get the current user ID from session/auth
    const mockUserId = 1

    const myLeads = await prisma.lead.count({
      where: { assignedToId: mockUserId }
    }).catch(() => 5)

    const myContacts = await prisma.contact.count({
      where: { assignedToId: mockUserId }
    }).catch(() => 12)

    const myDeals = await prisma.deal.count({
      where: { assignedToId: mockUserId }
    }).catch(() => 8)

    const myTasks = await prisma.task.count({
      where: { 
        assignedToId: mockUserId,
        status: { not: 'COMPLETED' }
      }
    }).catch(() => 3)

    return NextResponse.json({
      myLeads,
      myContacts,
      myDeals,
      myTasks
    })

  } catch (error) {
    console.error('Error fetching editor stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}