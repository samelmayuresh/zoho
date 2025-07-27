require('dotenv').config();
const { Resend } = require('resend');

console.log('🔍 Diagnosing Email Delivery Issue...');
console.log('Server says email sent successfully, but user not receiving it.');

const resend = new Resend(process.env.RESEND_API_KEY);

async function diagnoseEmailIssue() {
  try {
    console.log('\n📧 Current Email Configuration:');
    console.log('API Key:', process.env.RESEND_API_KEY ? 'Present' : 'Missing');
    console.log('From Email:', process.env.RESEND_FROM_EMAIL);
    console.log('From Name:', process.env.RESEND_FROM_NAME);
    
    console.log('\n🎯 Testing email to samelnamrata1@gmail.com...');
    
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['samelnamrata1@gmail.com'],
      subject: '🔍 Email Delivery Test - Zoho CRM',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">🔍 Email Delivery Diagnostic Test</h2>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          <p><strong>To:</strong> samelnamrata1@gmail.com</p>
          <p><strong>From:</strong> onboarding@resend.dev</p>
          
          <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>🎯 This is a test email to diagnose delivery issues</h3>
            <p>If you receive this email, the delivery system is working correctly.</p>
          </div>
          
          <h3>📋 Possible Issues:</h3>
          <ul>
            <li><strong>Spam Folder:</strong> Check your spam/junk folder</li>
            <li><strong>Email Filtering:</strong> Gmail may be filtering emails from unverified domains</li>
            <li><strong>Resend Limitations:</strong> Free tier has delivery restrictions</li>
            <li><strong>Domain Verification:</strong> onboarding@resend.dev may need domain verification</li>
          </ul>
          
          <h3>✅ Solutions:</h3>
          <ol>
            <li>Check spam folder first</li>
            <li>Add onboarding@resend.dev to contacts</li>
            <li>Verify domain in Resend dashboard</li>
            <li>Use a verified sending domain</li>
          </ol>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This diagnostic email was sent from Zoho CRM System
          </p>
        </div>
      `
    });

    if (error) {
      console.error('❌ Email failed:', error);
      
      if (error.message?.includes('403')) {
        console.log('\n💡 403 Error Solutions:');
        console.log('1. Verify your domain in Resend dashboard');
        console.log('2. Use only verified email addresses for testing');
        console.log('3. Check if recipient email is in allowed list');
      }
      
      return;
    }

    console.log('✅ Diagnostic email sent successfully!');
    console.log('📧 Email ID:', data.id);
    
    console.log('\n📬 Next Steps:');
    console.log('1. Check samelnamrata1@gmail.com inbox');
    console.log('2. Check spam/junk folder');
    console.log('3. If not received, the issue is with email delivery');
    
    console.log('\n🔧 Troubleshooting Tips:');
    console.log('• Gmail may filter emails from unverified domains');
    console.log('• Resend free tier has delivery limitations');
    console.log('• Domain verification may be required');
    console.log('• Check Resend dashboard for delivery status');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

diagnoseEmailIssue();