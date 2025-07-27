require('dotenv').config();
const { Resend } = require('resend');

console.log('📧 Testing Resend Email Direct...');
console.log('API Key:', process.env.RESEND_API_KEY ? 'Present' : 'Missing');

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  try {
    console.log('\n📤 Sending test email...');
    
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['mayureshsamel5@gmail.com'], // Your verified email
      subject: 'Test Email from Zoho CRM',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">🎉 Test Email Success!</h2>
          <p>This is a test email from your Zoho CRM system.</p>
          <p><strong>API Key:</strong> Working correctly</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        </div>
      `
    });

    if (error) {
      console.error('❌ Email failed:', error);
      return;
    }

    console.log('✅ Email sent successfully!');
    console.log('📧 Email ID:', data.id);
    console.log('📧 Data:', data);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testEmail();