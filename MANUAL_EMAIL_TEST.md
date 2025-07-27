# 📧 Manual Email Test for samelmayuresh40@gmail.com

## 🎯 **Test Goal:**
Send a real email with login credentials to `samelmayuresh40@gmail.com`

## 🚀 **Step-by-Step Test:**

### **Step 1: Ensure Server is Running**
```bash
npm run dev
```
Make sure you see: `✓ Ready in X.Xs`

### **Step 2: Login as Admin**
1. Go to: `http://localhost:3000/login`
2. Username: `admin_demo`
3. Password: `admin123!`
4. Should redirect to Admin Dashboard

### **Step 3: Create User with Real Email**
1. Click "Create User" button
2. Fill out the form:
   - **First Name:** Mayuresh
   - **Last Name:** Samel
   - **Email:** samelmayuresh40@gmail.com
   - **Role:** Partner (or any role you prefer)
3. Click "Create User"

### **Step 4: Check Results**
Look for success message:
```
✅ User created successfully and credentials sent via email
```

**OR** if email config issues:
```
✅ User created successfully! 

📧 Email logged to console (check server logs):

🔐 Credentials for samelmayuresh40@gmail.com:
• Username: mayuresh.samel_abc123
• Password: Xy9$mK2#pL8@qR5!
• Login URL: http://localhost:3000/login
```

### **Step 5: Check Email Inbox**
1. Go to Gmail: `samelmayuresh40@gmail.com`
2. Look for email from: "Zoho CRM System <onboarding@resend.dev>"
3. Subject: "Your Partner account is ready - Zoho CRM"
4. Check spam folder if not in inbox

### **Step 6: Test Login**
1. Use credentials from email or console
2. Go to: `http://localhost:3000/login`
3. Enter username and password
4. Should redirect to Partner Portal

## 🔍 **Expected Email Content:**

```
Subject: Your Partner account is ready - Zoho CRM
From: Zoho CRM System <onboarding@resend.dev>
To: samelmayuresh40@gmail.com

🎉 Welcome to Zoho CRM

Your Partner account has been created

Hello,

Your Partner account for Zoho CRM has been successfully created. You can create leads and view limited CRM information.

🔐 Your Login Credentials
Email: samelmayuresh40@gmail.com
Username: mayuresh.samel_abc123
Password: [Generated Password]
Role: Partner

⚠️ Important Security Notice:
• Please change your password after your first login
• Do not share these credentials with anyone
• Keep this email secure or delete it after logging in

[Login to Your Account Button]

🚀 What's Next?
1. Click the login button above or visit: http://localhost:3000/login
2. Use your username and password to sign in
3. Complete your profile setup
4. Start using the CRM system

📞 Need Help?
If you have any questions or need assistance, please contact our support team.

This email was sent from Zoho CRM System
© 2025 Zoho CRM. All rights reserved.
```

## 🧪 **Alternative: Use Test Script**
```bash
node send-test-email.js
```

## ✅ **Success Indicators:**
- ✅ User created successfully message
- ✅ "Email sent: true" in response
- ✅ "Mock email: false" in response
- ✅ Email received in Gmail inbox
- ✅ Login works with emailed credentials
- ✅ Redirects to Partner Portal after login

## 🔧 **If Email Doesn't Send:**
1. Check server console for error messages
2. Verify Resend API key is correct
3. Try restarting the development server
4. Check if user already exists (delete and retry)

Ready to test! Follow the steps above to send a real email to samelmayuresh40@gmail.com.