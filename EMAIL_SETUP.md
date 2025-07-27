# Email Setup Instructions

## 🚀 Quick Setup (Resend)

1. **Sign up for Resend** (recommended)
   - Go to [resend.com](https://resend.com)
   - Create a free account
   - Get your API key from the dashboard

2. **Configure Environment Variables**
   Add these to your `.env` file:
   ```env
   RESEND_API_KEY="re_your_api_key_here"
   RESEND_FROM_EMAIL="noreply@yourdomain.com"
   RESEND_FROM_NAME="Zoho CRM System"
   RESEND_BACKUP_EMAIL="admin@yourdomain.com"
   ```

3. **Domain Setup (Optional)**
   - For production, add your domain to Resend
   - Verify DNS records
   - Use your domain in `RESEND_FROM_EMAIL`

## 🧪 Testing Without Email Setup

If you don't configure email, the system will:
- ✅ Still create users successfully
- 📝 Log credentials to the server console
- 💬 Show credentials in the admin interface
- ⚠️ Display a warning that email wasn't sent

## 📧 Email Template Features

- **Role-specific content** - Different messages for each role
- **Professional HTML design** - Responsive email template
- **Security warnings** - Reminds users to change passwords
- **Direct login links** - One-click access to the system
- **Fallback text version** - Works in all email clients

## 🔧 Alternative Email Providers

You can modify `src/lib/resend.ts` to use other providers:
- SendGrid
- Mailgun
- AWS SES
- Nodemailer with SMTP

## 🐛 Troubleshooting

**Email not sending?**
1. Check API key is correct
2. Verify from email domain
3. Check server console for errors
4. Test with a simple email first

**Users not receiving emails?**
1. Check spam folder
2. Verify email address is correct
3. Check Resend dashboard for delivery status
4. Try with a different email provider

## 📋 Testing Checklist

- [ ] Create admin user
- [ ] Create editor user  
- [ ] Create viewer user
- [ ] Create partner user
- [ ] Check email delivery
- [ ] Verify login credentials work
- [ ] Test role-specific redirects