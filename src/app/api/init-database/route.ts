import { NextRequest, NextResponse } from 'next/server'
import { initializeDatabase, testRLSPolicies } from '@/lib/auth-sync'

export async function POST(request: NextRequest) {
  try {
    const { action, userId } = await request.json()

    if (action === 'initialize') {
      const result = await initializeDatabase()
      
      if (!result.success) {
        return NextResponse.json(
          { error: 'Database initialization failed', details: result.error },
          { status: 500 }
        )
      }

      return NextResponse.json({
        message: 'Database initialized successfully',
        success: true
      })
    }

    if (action === 'test-rls' && userId) {
      const result = await testRLSPolicies(userId)
      
      if (!result.success) {
        return NextResponse.json(
          { error: 'RLS test failed', details: result.error },
          { status: 500 }
        )
      }

      return NextResponse.json({
        message: 'RLS policies tested successfully',
        success: true,
        data: result
      })
    }

    if (action === 'init-permissions') {
      const { initializeDefaultPermissions } = await import('@/lib/permissions')
      const result = await initializeDefaultPermissions()
      
      if (!result.success) {
        return NextResponse.json(
          { error: 'Permission initialization failed', details: result.error },
          { status: 500 }
        )
      }

      return NextResponse.json({
        message: 'Default permissions initialized successfully',
        success: true
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Database API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}