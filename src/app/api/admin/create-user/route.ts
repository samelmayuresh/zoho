import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { generateCredentials, hashPassword, isValidRole } from '@/lib/auth-utils'
import { sendWelcomeEmail } from '@/lib/email-templates'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, phone, role, sendSMS } = await request.json()

    if (!firstName || !lastName || !email || !role) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (sendSMS && !phone) {
      return NextResponse.json(
        { error: 'Phone number is required for SMS delivery' },
        { status: 400 }
      )
    }

    // Validate role
    if (!isValidRole(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Generate credentials
    const { username, password } = generateCredentials(firstName, lastName, email)
    const hashedPassword = await hashPassword(password)

    // Create user
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        role,
        username,
        password: hashedPassword,
        isActive: true
      }
    })

    // Send welcome email with credentials
    let emailResult = null
    try {
      emailResult = await sendWelcomeEmail({
        email,
        firstName,
        role,
        username,
        password
      })
      
      if (!emailResult.success) {
        console.warn('Email sending failed:', emailResult.error)
      }
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Don't fail the user creation if email fails
    }

    // Send SMS if requested and phone number provided
    let smsResult = null
    if (sendSMS && phone) {
      try {
        const { sendCredentialsSMS } = await import('@/lib/twilio-sms')
        smsResult = await sendCredentialsSMS({
          phone,
          firstName,
          role,
          username,
          password
        })
        
        if (!smsResult.success) {
          console.warn('SMS sending failed:', smsResult.error)
        }
      } catch (smsError) {
        console.error('Failed to send SMS:', smsError)
        // Don't fail the user creation if SMS fails
      }
    }

    // Prepare response message based on email and SMS results
    let message = 'User created successfully'
    
    // ALWAYS provide credentials to admin for manual sharing
    let credentials = {
      username: newUser.username,
      password: password,
      loginUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login`
    }
    
    // Email status
    if (emailResult?.success && !emailResult?.mockEmail) {
      message += ' and credentials sent via email'
    } else if (emailResult?.success && emailResult?.mockEmail) {
      message += '. Email logged to console (mock mode)'
    } else if (emailResult?.simulatedEmail) {
      message += '. Email configuration missing - credentials logged to console'
    } else {
      message += '. Email sending failed'
    }

    // SMS status
    if (sendSMS && phone) {
      if (smsResult?.success && !smsResult?.mockSMS) {
        message += ' and SMS'
      } else if (smsResult?.success && smsResult?.mockSMS) {
        message += ' and SMS logged to console (mock mode)'
        credentials = smsResult.credentials
      } else {
        message += '. SMS sending failed'
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        username: newUser.username
      },
      credentials,
      emailSent: emailResult?.success || false,
      mockEmail: emailResult?.mockEmail || false,
      smsSent: smsResult?.success || false,
      mockSMS: smsResult?.mockSMS || false,
      smsPhone: smsResult?.phone,
      message
    })

  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}