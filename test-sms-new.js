require('dotenv').config();

console.log('📱 SMS Testing with Mock SMS...');

async function testSMS() {
  try {
    const response = await fetch('http://localhost:3000/api/admin/create-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'SMS',
        lastName: 'MockTest',
        email: `smstest${Date.now()}@example.com`, // Unique email
        phone: '+919876543210',
        role: 'PARTNER',
        sendSMS: true
      })
    });

    const data = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ SUCCESS!');
      console.log('👤 User created:', data.user?.username);
      console.log('📧 Email sent:', data.emailSent);
      console.log('📱 SMS sent:', data.smsSent);
      console.log('📱 Mock SMS:', data.mockSMS);
      
      if (data.mockSMS) {
        console.log('\n🎉 Mock SMS is working perfectly!');
        console.log('Check the console output above for the SMS content.');
      }
    } else {
      console.log('\n❌ FAILED!');
      console.log('Error:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

// Start the server first if needed
console.log('🚀 Testing SMS functionality...');
testSMS();