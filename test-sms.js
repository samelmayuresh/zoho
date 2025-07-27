// Test SMS functionality with Twilio
// Run with: node test-sms.js

const testSMS = async () => {
  try {
    console.log('📱 Testing SMS credentials delivery...')
    
    const testUser = {
      firstName: 'SMS',
      lastName: 'Test',
      email: 'smstest@example.com',
      phone: '+919876543210', // Replace with your Indian phone number for testing
      role: 'PARTNER',
      sendSMS: true
    }

    console.log('📝 Creating user with SMS enabled:', testUser)

    const response = await fetch('http://localhost:3000/api/admin/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    })

    const result = await response.json()
    
    console.log('\n📊 Response Status:', response.status)
    console.log('📊 Response Data:', JSON.stringify(result, null, 2))
    
    if (response.ok) {
      console.log('\n✅ SUCCESS!')
      console.log('👤 User created:', result.user?.username)
      console.log('📧 Email sent:', result.emailSent)
      console.log('📱 SMS sent:', result.smsSent)
      console.log('📞 SMS phone:', result.smsPhone)
      
      if (result.smsSent && !result.mockSMS) {
        console.log('\n🎉 REAL SMS SENT!')
        console.log('📱 Check your phone for the credentials')
        console.log('📞 Sent to:', result.smsPhone)
      } else if (result.mockSMS) {
        console.log('\n📝 Mock SMS used (check console logs)')
        if (result.credentials) {
          console.log('🔐 Login credentials:')
          console.log('   Username:', result.credentials.username)
          console.log('   Password:', result.credentials.password)
          console.log('   Login URL:', result.credentials.loginUrl)
        }
      } else {
        console.log('\n⚠️ SMS not sent - check Twilio configuration')
      }
      
      console.log('\n💡 Message:', result.message)
      
    } else {
      console.log('\n❌ FAILED!')
      console.log('Error:', result.error)
    }
    
  } catch (error) {
    console.log('\n❌ Test failed:', error.message)
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 Make sure the development server is running:')
      console.log('   npm run dev')
    }
  }
}

// Instructions
console.log('📱 SMS Testing Instructions:')
console.log('1. Update the phone number in this script to your real number')
console.log('2. Configure Twilio credentials in .env file (optional)')
console.log('3. Run: node test-sms.js')
console.log('4. Check your phone for SMS or console for mock SMS')
console.log('')

// Run the test
console.log('🚀 Starting SMS test...')
testSMS()