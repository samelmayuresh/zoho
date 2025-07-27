import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Get user counts
    const totalUsers = await prisma.user.count()
    const activeUsers = await prisma.user.count({
      where: { isActive: true }
    })

    // Get lead counts
    const totalLeads = await prisma.lead.count().catch(() => 0)

    // Get deal counts and revenue
    const totalDeals = await prisma.deal.count().catch(() => 0)
    const dealsWithValue = await prisma.deal.findMany({
      select: { value: true }
    }).catch(() => [])
    
    const totalRevenue = dealsWithValue.reduce((sum, deal) => {
      return sum + (deal.value || 0)
    }, 0)

    return NextResponse.json({
      totalUsers,
      activeUsers,
      totalLeads,
      totalDeals,
      totalRevenue
    })

  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}