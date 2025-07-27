// Twilio SMS service for sending credentials
import { Role } from '@prisma/client'

interface SMSCredentialData {
    phone: string
    firstName: string
    role: Role
    username: string
    password: string
}

export async function sendCredentialsSMS(data: SMSCredentialData) {
    // Check if Twilio is configured
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
        console.warn('📱 Twilio configuration missing. Using mock SMS.')
        return sendMockSMS(data)
    }

    try {
        const twilio = require('twilio')
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

        const roleDisplayName = {
            ADMIN: 'Administrator',
            EDITOR: 'Editor',
            VIEWER: 'Viewer',
            PARTNER: 'Partner'
        }[data.role]

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

        const message = `🎉 Welcome to Zoho CRM!

Your ${roleDisplayName} account is ready.

🔐 Login Credentials:
Username: ${data.username}
Password: ${data.password}

🌐 Login: ${appUrl}/login

⚠️ Keep these credentials secure and change your password after first login.

- Zoho CRM Team`

        const result = await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: data.phone
        })

        console.log('✅ SMS sent successfully to:', data.phone)
        console.log('📱 Message SID:', result.sid)

        return {
            success: true,
            messageSid: result.sid,
            phone: data.phone,
            message: 'SMS sent successfully'
        }

    } catch (error) {
        console.error('❌ Failed to send SMS:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return {
            success: false,
            error: errorMessage,
            fallback: sendMockSMS(data)
        }
    }
}

// Mock SMS for testing without Twilio setup
function sendMockSMS(data: SMSCredentialData) {
    const roleDisplayName = {
        ADMIN: 'Administrator',
        EDITOR: 'Editor',
        VIEWER: 'Viewer',
        PARTNER: 'Partner'
    }[data.role]

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const smsContent = `🎉 Welcome to Zoho CRM!

Your ${roleDisplayName} account is ready.

🔐 Login Credentials:
Username: ${data.username}
Password: ${data.password}

🌐 Login: ${appUrl}/login

⚠️ Keep these credentials secure and change your password after first login.

- Zoho CRM Team`

    console.log('\n📱 =============== SMS SENT ===============')
    console.log(`📱 To: ${data.phone}`)
    console.log('📱 Message:')
    console.log(smsContent)
    console.log('📱 ========================================\n')

    // Store mock SMS in memory for UI display
    if (typeof global !== 'undefined') {
        const globalAny = global as any
        if (!globalAny.mockSMS) {
            globalAny.mockSMS = []
        }
        globalAny.mockSMS.push({
            phone: data.phone,
            message: smsContent,
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
        mockSMS: true,
        phone: data.phone,
        credentials: {
            username: data.username,
            password: data.password,
            loginUrl: `${appUrl}/login`
        },
        message: 'Mock SMS logged to console'
    }
}

// Get stored mock SMS messages
export function getMockSMS() {
    if (typeof global !== 'undefined') {
        const globalAny = global as any
        return globalAny.mockSMS || []
    }
    return []
}

// Clear mock SMS messages
export function clearMockSMS() {
    if (typeof global !== 'undefined') {
        const globalAny = global as any
        globalAny.mockSMS = []
    }
}