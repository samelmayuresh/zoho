require('dotenv').config();

console.log('📧 Testing User Email Delivery...');
console.log('This will create a user and send credentials to THEIR email address');

async function testUserEmailDelivery() {
  try {
    // Create a user with a different email to demonstrate
    const testUserEmail = 'testuser@example.com'; // This would be the new user's email
    const uniqueEmail = `mayureshsamel5+newuser${Date.now()}@gmail.com`; // Using your Gmail with alias
    
    console.log('\n📝 Creating user account...');
    console.log('👤 User email (where credentials will be sent):', uniqueEmail);
    
    const response = await fetch('http://localhost:3000/api/admin/create-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'New',
        lastName: 'User',
        email: uniqueEmail, // This is where credentials will be sent
        phone: '+919876543210',
        role: 'EDITOR',
        sendSMS: false // Focus on email only
      })
    });

    const data = await response.json();
    
    console.log('\n📊 Response Status:', response.status);
    
    if (response.ok) {
      console.log('\n🎉 SUCCESS! User Created!');
      console.log('👤 Username:', data.user?.username);
      console.log('📧 Email sent to USER:', data.emailSent ? '✅ YES' : '❌ NO');
      console.log('📬 Recipient email:', data.user?.email);
      
      if (data.emailSent) {
        console.log('\n✅ CREDENTIALS SENT TO USER\'S EMAIL!');
        console.log('📧 The new user will receive:');
        console.log('   - Username:', data.user?.username);
        console.log('   - Password: (auto-generated)');
        console.log('   - Login instructions');
        console.log('   - Direct login link');
        console.log('\n📬 Check your Gmail inbox (using alias):', uniqueEmail);
      }
      
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

console.log('🚀 Starting user email delivery test...');
testUserEmailDelivery();