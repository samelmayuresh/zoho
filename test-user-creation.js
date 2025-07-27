// Simple test script to verify user creation
// Run with: node test-user-creation.js

const testUserCreation = async () => {
  const testUser = {
    firstName: 'Test',
    lastName: 'Partner',
    email: 'test.partner@example.com',
    role: 'PARTNER'
  }

  try {
    console.log('🧪 Testing user creation...')
    console.log('📝 Test user data:', testUser)

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
      console.log('👤 User created:', result.user.username)
      
      if (result.credentials) {
        console.log('🔐 Credentials (email not configured):')
        console.log('   Username:', result.credentials.username)
        console.log('   Password:', result.credentials.password)
        console.log('   Login URL:', result.credentials.loginUrl)
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
testUserCreation()