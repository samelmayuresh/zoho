require('dotenv').config();
const twilio = require('twilio');

console.log('🔧 Checking Twilio Account Phone Numbers...');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function checkNumbers() {
  try {
    console.log('\n📞 Fetching available phone numbers...');
    
    const phoneNumbers = await client.incomingPhoneNumbers.list();
    
    if (phoneNumbers.length === 0) {
      console.log('❌ No phone numbers found in your Twilio account');
      console.log('\n💡 Solutions:');
      console.log('1. Buy a phone number from Twilio Console');
      console.log('2. Use Twilio trial number if available');
      console.log('3. Verify your existing number');
    } else {
      console.log('✅ Available phone numbers:');
      phoneNumbers.forEach((number, index) => {
        console.log(`${index + 1}. ${number.phoneNumber} (${number.friendlyName})`);
      });
    }
    
    // Also check account info
    console.log('\n📊 Account Information:');
    const account = await client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
    console.log('Account Status:', account.status);
    console.log('Account Type:', account.type);
    
  } catch (error) {
    console.error('❌ Error checking account:', error.message);
    console.error('Error code:', error.code);
  }
}

checkNumbers();