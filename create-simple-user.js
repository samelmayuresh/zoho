// Create a user with simple, known credentials
// Run with: node create-simple-user.js

const createSimpleUser = async () => {
  try {
    console.log('👤 Creating simple test user...')
    
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      role: 'PARTNER'
    }

    console.log('📝 User data:', testUser)

    const response = await fetch('http://localhost:3000/api/admin/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    })

    const result = await response.json()
    
    if (response.ok) {
      console.log('\n✅ User created successfully!')
      console.log('👤 Username:', result.user?.username)
      
      if (result.credentials) {
        console.log('\n🔐 LOGIN CREDENTIALS:')
        console.log('Username:', result.credentials.username)
        console.log('Password:', result.credentials.password)
        console.log('Login URL:', result.credentials.loginUrl)
        
        console.log('\n📋 COPY THESE FOR LOGIN TEST:')
        console.log(`Username: ${result.credentials.username}`)
        console.log(`Password: ${result.credentials.password}`)
        
        // Now test the login immediately
        console.log('\n🧪 Testing login with these credentials...')
        
        const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: result.credentials.username,
            password: result.credentials.password
          })
        })

        const loginResult = await loginResponse.json()
        
        if (loginResponse.ok) {
          console.log('✅ LOGIN TEST SUCCESSFUL!')
          console.log('🎭 Role:', loginResult.user?.role)
          console.log('📧 Email:', loginResult.user?.email)
        } else {
          console.log('❌ LOGIN TEST FAILED!')
          console.log('Error:', loginResult.error)
        }
        
      } else {
        console.log('\n⚠️ No credentials in response')
        console.log('Full response:', JSON.stringify(result, null, 2))
      }
      
    } else {
      console.log('\n❌ User creation failed!')
      console.log('Error:', result.error)
      
      if (result.error?.includes('already exists')) {
        console.log('\n💡 User already exists. Try deleting the existing user first.')
      }
    }
    
  } catch (error) {
    console.log('\n❌ Test failed:', error.message)
    console.log('💡 Make sure the development server is running (npm run dev)')
  }
}

// Run the test
console.log('🚀 Creating simple test user...')
createSimpleUser()