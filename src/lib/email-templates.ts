import { Role } from '@prisma/client'

interface RoleWelcomeEmailData {
  role: Role
  username: string
  password: string
  appUrl: string
  userEmail: string
}

export function getRoleWelcomeEmailTemplate(data: RoleWelcomeEmailData) {
  const { role, username, password, appUrl, userEmail } = data
  
  const roleDisplayName = {
    ADMIN: 'Administrator',
    EDITOR: 'Editor',
    VIEWER: 'Viewer',
    PARTNER: 'Partner'
  }[role]

  const roleDescription = {
    ADMIN: 'You have full administrative access to the CRM system.',
    EDITOR: 'You can create and edit leads, contacts, accounts, deals, and projects.',
    VIEWER: 'You have read-only access to view CRM data and reports.',
    PARTNER: 'You can create leads and view limited CRM information.'
  }[role]

  const loginUrl = `${appUrl}/login`

  return {
    subject: `Your ${roleDisplayName} account is ready - Zoho CRM`,
    html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Zoho CRM</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .credentials { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Welcome to Zoho CRM</h1>
            <p>Your ${roleDisplayName} account has been created</p>
        </div>
        
        <div class="content">
            <p>Hello,</p>
            
            <p>Your ${roleDisplayName} account for Zoho CRM has been successfully created. ${roleDescription}</p>
            
            <div class="credentials">
                <h3>🔐 Your Login Credentials</h3>
                <p><strong>Email:</strong> ${userEmail}</p>
                <p><strong>Username:</strong> <code>${username}</code></p>
                <p><strong>Password:</strong> <code>${password}</code></p>
                <p><strong>Role:</strong> ${roleDisplayName}</p>
            </div>
            
            <div class="warning">
                <strong>⚠️ Important Security Notice:</strong>
                <ul>
                    <li>Please change your password after your first login</li>
                    <li>Do not share these credentials with anyone</li>
                    <li>Keep this email secure or delete it after logging in</li>
                </ul>
            </div>
            
            <div style="text-align: center;">
                <a href="${loginUrl}" class="button">Login to Your Account</a>
            </div>
            
            <h3>🚀 What's Next?</h3>
            <ol>
                <li>Click the login button above or visit: <a href="${loginUrl}">${loginUrl}</a></li>
                <li>Use your username and password to sign in</li>
                <li>Complete your profile setup</li>
                <li>Start using the CRM system</li>
            </ol>
            
            <h3>📞 Need Help?</h3>
            <p>If you have any questions or need assistance, please contact our support team.</p>
        </div>
        
        <div class="footer">
            <p>This email was sent from Zoho CRM System</p>
            <p>© 2025 Zoho CRM. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`,
    text: `
Welcome to Zoho CRM!

Your ${roleDisplayName} account has been created successfully.

Login Credentials:
- Email: ${userEmail}
- Username: ${username}
- Password: ${password}
- Role: ${roleDisplayName}

Login URL: ${loginUrl}

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
}

export async function sendRoleWelcomeEmail(data: RoleWelcomeEmailData) {
  // Check if email configuration is available
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your_resend_api_key_here') {
    console.warn('Email configuration missing. Skipping email send.')
    console.log('📧 Email would have been sent to:', data.userEmail)
    console.log('📧 Subject:', `Your ${data.role} account is ready - Zoho CRM`)
    console.log('📧 Username:', data.username)
    console.log('📧 Login URL:', `${data.appUrl}/login`)
    return { 
      success: false, 
      error: 'Email configuration missing',
      simulatedEmail: {
        to: data.userEmail,
        subject: `Your ${data.role} account is ready - Zoho CRM`,
        username: data.username,
        loginUrl: `${data.appUrl}/login`
      }
    }
  }

  const { resend } = await import('./resend')
  
  // If resend is null (no API key), fall back to mock email
  if (!resend) {
    console.log('📧 Resend not configured, using mock email...')
    const { sendMockWelcomeEmail } = await import('./mock-email')
    return sendMockWelcomeEmail({
      email: data.userEmail,
      firstName: 'User',
      role: data.role,
      username: data.username,
      password: data.password
    })
  }
  
  const template = getRoleWelcomeEmailTemplate(data)
  
  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: data.userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text
    })
    
    console.log('✅ Welcome email sent successfully to:', data.userEmail)
    return { success: true, data: result }
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error)
    console.log('📧 Email details that failed to send:')
    console.log('  - To:', data.userEmail)
    console.log('  - Username:', data.username)
    console.log('  - Role:', data.role)
    console.log('  - Login URL:', `${data.appUrl}/login`)
    return { success: false, error }
  }
}

// Simplified interface for the setup route
interface WelcomeEmailData {
  email: string
  firstName: string
  role: Role
  username: string
  password: string
}

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  // Check if real email is configured
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your_resend_api_key_here') {
    // Use mock email service
    const { sendMockWelcomeEmail } = await import('./mock-email')
    return sendMockWelcomeEmail(data)
  }
  
  return sendRoleWelcomeEmail({
    role: data.role,
    username: data.username,
    password: data.password,
    appUrl,
    userEmail: data.email
  })
}