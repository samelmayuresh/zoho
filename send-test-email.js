// Direct email test for samelmayuresh40@gmail.com
// Run with: node send-test-email.js

const testDirectEmail = async () => {
  try {
    console.log('📧 Testing email to samelmayuresh40@gmail.com...')
    
    // Test data
    const testUser = {
      firstName: 'Mayuresh',
      lastName: 'Samel', 
      email: 'samelmayuresh40@gmail.com',
      role: 'PARTNER'
    }

    console.log('📝 Creating user:', testUser)

    const response = await fetch('http://localhost:3000/api/admin/create-user', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    })

    const result = await response.json()
    
    console.log('\n📊 Response Status:', response.status)
    console.log('📊 Response Data:', JSON.stringify(result, null, 2))
    
    if (response.ok) {
      console.log('\n✅ SUCCESS!')
      console.log('👤 User created:', result.user?.username)
      console.log('📧 Email sent:', result.emailSent)
      console.log('🔄 Mock email:', result.mockEmail)
      
      if (result.emailSent && !result.mockEmail) {
        console.log('\n🎉 REAL EMAIL SENT!')
        console.log('📬 Check samelmayuresh40@gmail.com inbox')
        console.log('📧 Subject: Your Partner account is ready - Zoho CRM')
        console.log('📧 From: Zoho CRM System <onboarding@resend.dev>')
      } else if (result.mockEmail) {
        console.log('\n📝 Mock email used')
        if (result.credentials) {
          console.log('🔐 Login credentials:')
          console.log('   Username:', result.credentials.username)
          console.log('   Password:', result.credentials.password)
          console.log('   Login URL:', result.credentials.loginUrl)
        }
      }
      
      console.log('\n💡 Message:', result.message)
      
    } else {
      console.log('\n❌ FAILED!')
      console.log('Error:', result.error)
      
      if (result.error?.includes('already exists')) {
        console.log('\n💡 User already exists. Try with a different email or delete the existing user.')
      }
    }
    
  } catch (error) {
    console.log('\n❌ Test failed:', error.message)
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 Make sure the development server is running:')
      console.log('   npm run dev')
    }
  }
}

// Run the test
console.log('🚀 Starting email test...')
testDirectEmail()