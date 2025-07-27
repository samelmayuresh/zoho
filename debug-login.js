// Debug login issues
// Run with: node debug-login.js

const debugLogin = async () => {
  try {
    console.log('🔍 Debugging login system...')
    
    // First, let's create a test user
    console.log('\n1️⃣ Creating test user...')
    const createResponse = await fetch('http://localhost:3000/api/admin/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Debug',
        lastName: 'User',
        email: 'debug@test.com',
        role: 'VIEWER'
      })
    })

    const createResult = await createResponse.json()
    console.log('Create response:', createResult)

    if (!createResponse.ok) {
      if (createResult.error?.includes('already exists')) {
        console.log('✅ User already exists, continuing with login test...')
        // Try to get existing credentials from mock emails or use known format
        var testCredentials = {
          username: 'debug.user_test', // We'll try a few variations
          password: 'test123'
        }
      } else {
        console.log('❌ Failed to create user:', createResult.error)
        return
      }
    } else {
      var testCredentials = createResult.credentials || {
        username: createResult.user?.username,
        password: 'unknown'
      }
      console.log('✅ User created successfully!')
      console.log('🔐 Credentials:', testCredentials)
    }

    // Now test login
    console.log('\n2️⃣ Testing login...')
    console.log('Attempting login with:', testCredentials)

    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testCredentials)
    })

    const loginResult = await loginResponse.json()
    
    console.log('\n📊 Login Response:')
    console.log('Status:', loginResponse.status)
    console.log('Result:', JSON.stringify(loginResult, null, 2))

    if (loginResponse.ok) {
      console.log('\n✅ LOGIN SUCCESSFUL!')
      console.log('👤 Logged in as:', loginResult.user?.username)
      console.log('🎭 Role:', loginResult.user?.role)
    } else {
      console.log('\n❌ LOGIN FAILED!')
      console.log('Error:', loginResult.error)
      
      // Let's try to debug further
      console.log('\n🔍 Debugging further...')
      
      // Check if user exists in database
      console.log('Checking if user exists...')
      // We can't directly query the database from here, but we can try different username formats
      
      const variations = [
        'debug.user_test',
        'debuguser_test', 
        'debug_test',
        createResult.user?.username
      ].filter(Boolean)
      
      for (const username of variations) {
        console.log(`\n🧪 Trying username: ${username}`)
        const testLogin = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            password: testCredentials.password
          })
        })
        
        const testResult = await testLogin.json()
        if (testLogin.ok) {
          console.log('✅ SUCCESS with username:', username)
          break
        } else {
          console.log('❌ Failed:', testResult.error)
        }
      }
    }

  } catch (error) {
    console.log('\n❌ Debug failed:', error.message)
    console.log('💡 Make sure the development server is running (npm run dev)')
  }
}

// Run the debug
console.log('🚀 Starting login debug...')
debugLogin()