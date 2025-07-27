import { NextRequest, NextResponse } from 'next/server'
import { stytchClient } from '@/lib/stytch'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      )
    }

    // Reset password with token
    const response = await stytchClient.passwords.resetByEmail({
      token,
      password,
      session_duration_minutes: 60 * 24 * 7, // 7 days
    })

    if (response.status_code === 200) {
      return NextResponse.json({
        user: response.user,
        session: response.session,
      })
    } else {
      return NextResponse.json(
        { error: 'Password reset failed' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}