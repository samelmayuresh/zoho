// Mock email service for development/testing
import { Role } from '@prisma/client'

interface MockEmailData {
  email: string
  firstName: string
  role: Role
  username: string
  password: string
}

export async function sendMockWelcomeEmail(data: MockEmailData) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  const roleDisplayName = {
    ADMIN: 'Administrator',
    EDITOR: 'Editor', 
    VIEWER: 'Viewer',
    PARTNER: 'Partner'
  }[data.role]

  const emailContent = {
    to: data.email,
    subject: `Your ${roleDisplayName} account is ready - Zoho CRM`,
    body: `
Welcome to Zoho CRM!

Your ${roleDisplayName} account has been created successfully.

Login Credentials:
• Email: ${data.email}
• Username: ${data.username}
• Password: ${data.password}
• Role: ${roleDisplayName}

Login URL: ${appUrl}/login

Important: Please change your password after your first login and keep these credentials secure.

What's Next:
1. Visit the login URL above
2. Use your username and password to sign in
3. Complete your profile setup
4. Start using the CRM system

Need help? Contact our support team.

© 2025 Zoho CRM. All rights reserved.
    `
  }

  // Log email to console
  console.log('\n📧 =============== EMAIL SENT ===============')
  console.log(`📧 To: ${emailContent.to}`)
  console.log(`📧 Subject: ${emailContent.subject}`)
  console.log('\n🔐 LOGIN CREDENTIALS:')
  console.log(`Username: ${data.username}`)
  console.log(`Password: ${data.password}`)
  console.log(`Login URL: ${appUrl}/login`)
  console.log('\n📧 Full Email Body:')
  console.log(emailContent.body)
  console.log('📧 =========================================\n')

  // Store email in memory for UI display (in production, use database)
  if (typeof global !== 'undefined') {
    if (!global.mockEmails) {
      global.mockEmails = []
    }
    global.mockEmails.push({
      ...emailContent,
      timestamp: new Date().toISOString(),
      credentials: {
        username: data.username,
        password: data.password,
        loginUrl: `${appUrl}/login`
      }
    })
  }

  return {
    success: true,
    mockEmail: true,
    emailContent,
    credentials: {
      username: data.username,
      password: data.password,
      loginUrl: `${appUrl}/login`
    }
  }
}

// Get stored mock emails
export function getMockEmails() {
  if (typeof global !== 'undefined' && global.mockEmails) {
    return global.mockEmails
  }
  return []
}

// Clear mock emails
export function clearMockEmails() {
  if (typeof global !== 'undefined') {
    global.mockEmails = []
  }
}