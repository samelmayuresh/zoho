require('dotenv').config();

console.log('🎯 Testing Complete User Creation (Email + SMS)...');

async function testUserCreation() {
  try {
    const response = await fetch('http://localhost:3000/api/admin/create-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'Complete',
        lastName: 'Test',
        email: 'mayureshsamel5@gmail.com', // Your verified email
        phone: '+919876543210',
        role: 'EDITOR',
        sendSMS: true
      })
    });

    const data = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n🎉 SUCCESS!');
      console.log('👤 User created:', data.user?.username);
      console.log('📧 Email sent:', data.emailSent);
      console.log('📱 SMS sent:', data.smsSent);
      console.log('📱 Mock SMS:', data.mockSMS);
      
      if (data.emailSent && !data.mockEmail) {
        console.log('\n✅ Real email sent to mayureshsamel5@gmail.com');
        console.log('Check your inbox for the credentials!');
      }
      
      if (data.mockSMS) {
        console.log('\n📱 Mock SMS logged to console (check server logs)');
      }
      
      console.log('\n🔐 Login Credentials:');
      console.log('Username:', data.user?.username);
      console.log('Password: (sent via email)');
      console.log('Login URL: http://localhost:3000/login');
      
    } else {
      console.log('\n❌ FAILED!');
      console.log('Error:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    console.log('\n💡 Make sure the development server is running:');
    console.log('npm run dev');
  }
}

testUserCreation();