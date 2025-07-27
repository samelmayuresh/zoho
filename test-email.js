// Test email sending with Resend
// Run with: node test-email.js

const testEmail = async () => {
  try {
    console.log('🧪 Testing email sending with Resend...')
    
    const testUser = {
      firstName: 'Mayuresh',
      lastName: 'Samel',
      email: 'samelmayuresh40@gmail.com',
      role: 'PARTNER'
    }

    const response = await fetch('http://localhost:3000/api/admin/create-user', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // Note: In real usage, you'd need proper authentication
      },
      body: JSON.stringify(testUser)
    })

    const result = await response.json()
    
    if (response.ok) {
      console.log('✅ User creation successful!')
      console.log('📧 Email sent:', result.emailSent)
      console.log('🔄 Mock email:', result.mockEmail)
      console.log('👤 User created:', result.user.username)
      
      if (result.emailSent && !result.mockEmail) {
        console.log('🎉 Real email sent successfully!')
        console.log('📬 Check your inbox for the welcome email')
      } else if (result.mockEmail) {
        console.log('📝 Mock email used (check console logs)')
        if (result.credentials) {
          console.log('🔐 Credentials:')
          console.log('   Username:', result.credentials.username)
          console.log('   Password:', result.credentials.password)
        }
      }
    } else {
      console.log('❌ User creation failed:', result.error)
    }
  } catch (error) {
    console.log('❌ Test failed:', error.message)
    console.log('💡 Make sure the development server is running (npm run dev)')
  }
}

// Run the test
testEmail()