import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { getMockEmails } = await import('@/lib/mock-email')
    const emails = getMockEmails()
    
    return NextResponse.json({
      success: true,
      emails,
      count: emails.length
    })
  } catch (error) {
    console.error('Error fetching mock emails:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mock emails' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { clearMockEmails } = await import('@/lib/mock-email')
    clearMockEmails()
    
    return NextResponse.json({
      success: true,
      message: 'Mock emails cleared'
    })
  } catch (error) {
    console.error('Error clearing mock emails:', error)
    return NextResponse.json(
      { error: 'Failed to clear mock emails' },
      { status: 500 }
    )
  }
}