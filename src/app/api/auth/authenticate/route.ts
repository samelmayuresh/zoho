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

    // Authenticate the token with Stytch
    const response = await stytchClient.sessions.authenticate({
      session_token: token,
    })

    if (response.status_code === 200) {
      return NextResponse.json({
        user: response.user,
        session: response.session,
      })
    } else {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}