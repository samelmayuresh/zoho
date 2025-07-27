import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('crm-session')

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const sessionData = JSON.parse(sessionCookie.value)
    
    return NextResponse.json({
      success: true,
      user: {
        id: sessionData.userId,
        email: sessionData.email,
        firstName: sessionData.firstName,
        lastName: sessionData.lastName,
        role: sessionData.role,
        username: sessionData.username
      }
    })

  } catch (error) {
    console.error('Error checking authentication:', error)
    return NextResponse.json(
      { error: 'Invalid session' },
      { status: 401 }
    )
  }
}