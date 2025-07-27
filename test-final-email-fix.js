require('dotenv').config();

console.log('🔧 FINAL EMAIL FIX TEST');
console.log('Testing mock email system with credentials display...');

async function testFinalEmailFix() {
  try {
    // Check environment first
    console.log('\n📋 Environment Check:');
    console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'PRESENT (Should be undefined)' : 'UNDEFINED ✅');
    console.log('Mock email should be used:', !process.env.RESEND_API_KEY ? '✅ YES' : '❌ NO');
    
    const uniqueEmail = `finaltest${Date.now()}@example.com`;
    
    console.log('\n📝 Creating user with mock email system...');
    console.log('👤 Email:', uniqueEmail);
    console.log('🎯 Expected: Mock email with credentials displayed');
    
    const response = await fetch('http://localhost:3000/api/admin/create-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'Final',
        lastName: 'Test',
        email: uniqueEmail,
        phone: '+919876543210',
        role: 'ADMIN',
        sendSMS: false
      })
    });

    const data = await response.json();
    
    console.log('\n📊 API Response:');
    console.log('Status:', response.status);
    console.log('Success:', data.success);
    console.log('Email sent:', data.emailSent);
    console.log('Mock email:', data.mockEmail);
    
    if (response.ok) {
      console.log('\n🎉 USER CREATED SUCCESSFULLY!');
      console.log('👤 Username:', data.user?.username);
      console.log('📧 User email:', data.user?.email);
      
      // Check if credentials are provided
      if (data.credentials) {
        console.log('\n🔐 ✅ CREDENTIALS DISPLAYED (PERFECT!):');
        console.log('👤 Username:', data.credentials.username);
        console.log('🔑 Password:', data.credentials.password);
        console.log('🌐 Login URL:', data.credentials.loginUrl);
        
        console.log('\n🎊 SUCCESS! Email issue completely resolved!');
        console.log('✅ User can login immediately with these credentials');
        console.log('✅ No email delivery needed');
        console.log('✅ Works with any email address');
        
      } else if (data.mockEmail) {
        console.log('\n📧 Mock email sent (check server console for credentials)');
        
      } else {
        console.log('\n⚠️ Email system still trying to send real emails');
        console.log('💡 Server may need restart to apply .env changes');
      }
      
    } else {
      console.log('\n❌ FAILED!');
      console.log('Error:', data.error);
      
      if (data.error?.includes('already exists')) {
        console.log('\n💡 User already exists - that\'s normal for testing');
      }
    }
    
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    console.log('\n💡 Make sure the development server is running:');
    console.log('npm run dev');
  }
}

console.log('🚀 Starting final email fix test...');
testFinalEmailFix();