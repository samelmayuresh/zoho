require('dotenv').config();
const twilio = require('twilio');

console.log('🔧 Testing Twilio Configuration...');
console.log('Account SID:', process.env.TWILIO_ACCOUNT_SID);
console.log('Phone Number:', process.env.TWILIO_PHONE_NUMBER);
console.log('Auth Token exists:', !!process.env.TWILIO_AUTH_TOKEN);

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function testTwilio() {
  try {
    console.log('\n📱 Testing SMS send...');
    
    const message = await client.messages.create({
      body: 'Test SMS from Zoho CRM - Your credentials are ready!',
      from: process.env.TWILIO_PHONE_NUMBER,
      to: '+919876543210' // Test number
    });
    
    console.log('✅ SMS sent successfully!');
    console.log('Message SID:', message.sid);
    console.log('Status:', message.status);
    
  } catch (error) {
    console.error('❌ SMS failed:', error.message);
    console.error('Error code:', error.code);
    console.error('More info:', error.moreInfo);
  }
}

testTwilio();