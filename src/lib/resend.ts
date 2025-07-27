import { Resend } from 'resend'

// Only initialize Resend if API key is available
export const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export const emailConfig = {
  from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
  fromName: process.env.RESEND_FROM_NAME || 'Zoho CRM System',
  backupEmail: process.env.RESEND_BACKUP_EMAIL || 'admin@example.com',
}