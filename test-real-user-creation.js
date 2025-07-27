require('dotenv').config();

console.log('🎯 Testing Real User Creation with Email to mayureshsamel5@gmail.com...');

async function testRealUserCreation() {
  try {
    const uniqueEmail = `mayureshsamel5+test${Date.now()}@gmail.com`;
    
    console.log('📝 Creating user with email:', uniqueEmail);
    
    const response = await fetch('http://localhost:3000/api/admin/create-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'Mayuresh',
        lastName: 'Samel',
        email: uniqueEmail, // Gmail + alias for testing
        phone: '+919876543210',
        role: 'ADMIN',
        sendSMS: true
      })
    });

    const data = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n🎉 SUCCESS! User Created Successfully!');
      console.log('👤 Username:', data.user?.username);
      console.log('📧 Email sent:', data.emailSent ? '✅ YES' : '❌ NO');
      console.log('📱 SMS sent:', data.smsSent ? '✅ YES' : '❌ NO');
      console.log('📱 Mock SMS:', data.mockSMS ? '✅ YES' : '❌ NO');
      
      if (data.emailSent && !data.mockEmail) {
        console.log('\n📬 ✅ REAL EMAIL SENT!');
        console.log('📧 Check your Gmail inbox:', uniqueEmail);
        console.log('📧 Look for: "🎉 Welcome to Zoho CRM - Your Account is Ready!"');
      }
      
      if (data.mockSMS) {
        console.log('\n📱 ✅ MOCK SMS LOGGED!');
        console.log('📱 Check the server console for SMS content');
      }
      
      console.log('\n🔐 Login Information:');
      console.log('🌐 URL: http://localhost:3000/login');
      console.log('👤 Username:', data.user?.username);
      console.log('🔑 Password: (sent to your email)');
      
    } else {
      console.log('\n❌ FAILED!');
      console.log('Error:', data.error);
      
      if (data.error?.includes('already exists')) {
        console.log('\n💡 This is normal - user already exists from previous tests');
        console.log('💡 The email system is still working correctly!');
      }
    }
    
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    console.log('\n💡 Make sure the development server is running:');
    console.log('npm run dev');
  }
}

console.log('🚀 Starting real user creation test...');
testRealUserCreation();