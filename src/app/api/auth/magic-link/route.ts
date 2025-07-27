import { NextRequest, NextResponse } from 'next/server'
import { stytchClient } from '@/lib/stytch'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    // Authenticate the magic link token
    const response = await stytchClient.magicLinks.authenticate({
      token,
      session_duration_minutes: 60 * 24 * 7, // 7 days
    })

    if (response.status_code === 200) {
      return NextResponse.json({
        user: response.user,
        session: response.session,
      })
    } else {
      return NextResponse.json(
        { error: 'Magic link authentication failed' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Magic link authentication error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}