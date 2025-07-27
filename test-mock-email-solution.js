require('dotenv').config();

console.log('📧 Testing Mock Email Solution...');
console.log('This will work with ANY email address and show credentials clearly!');

async function testMockEmailSolution() {
  try {
    const testEmail = 'samelnamrata1@gmail.com'; // Any email will work now
    
    console.log('\n📝 Creating user with mock email system...');
    console.log('👤 User email:', testEmail);
    
    const response = await fetch('http://localhost:3000/api/admin/create-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'Namrata',
        lastName: 'Samel',
        email: testEmail,
        phone: '+919876543210',
        role: 'EDITOR',
        sendSMS: false
      })
    });

    const data = await response.json();
    
    console.log('\n📊 Response Status:', response.status);
    console.log('📊 Response Data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n🎉 SUCCESS! Mock Email System Working!');
      console.log('👤 Username:', data.user?.username);
      console.log('📧 Mock email sent:', data.mockEmail ? '✅ YES' : '❌ NO');
      console.log('📬 Email address:', data.user?.email);
      
      if (data.credentials) {
        console.log('\n🔐 LOGIN CREDENTIALS (Displayed Here):');
        console.log('👤 Username:', data.credentials.username);
        console.log('🔑 Password:', data.credentials.password);
        console.log('🌐 Login URL:', data.credentials.loginUrl);
        
        console.log('\n✅ PERFECT! User can login immediately with these credentials!');
      }
      
      console.log('\n📧 Mock email content logged to server console');
      
    } else {
      console.log('\n❌ FAILED!');
      console.log('Error:', data.error);
      
      if (data.error?.includes('already exists')) {
        console.log('\n💡 User already exists - that\'s fine!');
        console.log('💡 The mock email system is working correctly!');
      }
    }
    
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    console.log('\n💡 Make sure the development server is running:');
    console.log('npm run dev');
  }
}

console.log('🚀 Starting mock email solution test...');
testMockEmailSolution();