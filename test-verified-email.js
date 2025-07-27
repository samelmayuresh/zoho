require('dotenv').config();

console.log('📧 Testing Email to Verified Address (mayureshsamel5@gmail.com)...');

async function testVerifiedEmail() {
  try {
    const response = await fetch('http://localhost:3000/api/admin/create-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: 'mayureshsamel5@gmail.com', // Your verified email
        phone: '+919876543210',
        role: 'EDITOR',
        sendSMS: false
      })
    });

    const data = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n🎉 SUCCESS!');
      console.log('📧 Email should be sent to: mayureshsamel5@gmail.com');
      console.log('📬 Check your Gmail inbox for credentials!');
    } else {
      console.log('\n❌ FAILED!');
      console.log('Error:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

testVerifiedEmail();