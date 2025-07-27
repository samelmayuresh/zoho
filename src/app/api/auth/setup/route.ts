import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { generateCredentials, hashPassword } from '@/lib/auth-utils'
import { sendWelcomeEmail } from '@/lib/email-templates'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { clerkId, email, firstName, lastName, role } = await request.json()

    if (!clerkId || !email || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles = ['ADMIN', 'EDITOR', 'VIEWER', 'PARTNER']
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkId }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }

    // Generate credentials for role-based login
    const { username, password } = generateCredentials(firstName, lastName, email)
    const hashedPassword = await hashPassword(password)

    // Create user with role
    const newUser = await prisma.user.create({
      data: {
        clerkId,
        email,
        firstName: firstName || '',
        lastName: lastName || '',
        role,
        username,
        password: hashedPassword,
        isActive: true
      }
    })

    // Send welcome email with credentials
    try {
      await sendWelcomeEmail({
        email,
        firstName: firstName || 'User',
        role,
        username,
        password
      })
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Don't fail the user creation if email fails
    }

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        username: newUser.username
      },
      message: 'Account setup completed successfully'
    })

  } catch (error) {
    console.error('Error setting up user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}