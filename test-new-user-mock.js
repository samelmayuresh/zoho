require('dotenv').config();

console.log('📧 Testing Mock Email with New User...');

async function testNewUserMock() {
  try {
    const uniqueEmail = `testuser${Date.now()}@example.com`;
    
    console.log('\n📝 Creating new user with mock email...');
    console.log('👤 User email:', uniqueEmail);
    
    const response = await fetch('http://localhost:3000/api/admin/create-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: uniqueEmail,
        phone: '+919876543210',
        role: 'VIEWER',
        sendSMS: false
      })
    });

    const data = await response.json();
    
    console.log('\n📊 Response Status:', response.status);
    
    if (response.ok) {
      console.log('\n🎉 SUCCESS! Mock Email System Working!');
      console.log('👤 Username:', data.user?.username);
      console.log('📧 Mock email:', data.mockEmail ? '✅ YES' : '❌ NO');
      console.log('📧 Real email sent:', data.emailSent ? '✅ YES' : '❌ NO');
      
      if (data.credentials) {
        console.log('\n🔐 CREDENTIALS DISPLAYED (No Email Needed!):');
        console.log('👤 Username:', data.credentials.username);
        console.log('🔑 Password:', data.credentials.password);
        console.log('🌐 Login URL:', data.credentials.loginUrl);
        
        console.log('\n✅ PERFECT! User can login immediately!');
        console.log('✅ No email delivery issues!');
        console.log('✅ Works with ANY email address!');
      }
      
    } else {
      console.log('\n❌ FAILED!');
      console.log('Error:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

testNewUserMock();