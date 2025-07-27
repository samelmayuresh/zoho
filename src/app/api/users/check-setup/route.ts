import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { clerkId, email, firstName, lastName } = await request.json()

    if (!clerkId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkId }
    })

    if (existingUser) {
      // User exists, return their info
      return NextResponse.json({
        needsSetup: false,
        user: {
          id: existingUser.id,
          email: existingUser.email,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          role: existingUser.role,
          isActive: existingUser.isActive
        }
      })
    }

    // User doesn't exist, they need setup
    return NextResponse.json({
      needsSetup: true,
      userData: {
        clerkId,
        email,
        firstName,
        lastName
      }
    })

  } catch (error) {
    console.error('Error checking user setup:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}