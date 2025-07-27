require('dotenv').config();
const { Resend } = require('resend');

console.log('📧 Sending Credential Email to mayureshsamel5@gmail.com...');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendCredentialEmail() {
  try {
    const testCredentials = {
      firstName: 'Mayuresh',
      role: 'ADMIN',
      username: 'mayuresh_admin',
      password: 'quickcat42'
    };

    const roleDisplayName = {
      ADMIN: 'Administrator',
      EDITOR: 'Editor', 
      VIEWER: 'Viewer',
      PARTNER: 'Partner'
    }[testCredentials.role];

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Zoho CRM</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Welcome to Zoho CRM!</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <p style="font-size: 18px; margin-bottom: 20px;">Hello <strong>${testCredentials.firstName}</strong>,</p>
            
            <p>Your <strong>${roleDisplayName}</strong> account has been created successfully! You now have access to the Zoho CRM system.</p>
            
            <div style="background: white; padding: 25px; border-radius: 8px; border-left: 4px solid #667eea; margin: 25px 0;">
                <h3 style="color: #667eea; margin-top: 0;">🔐 Your Login Credentials</h3>
                <p style="margin: 10px 0;"><strong>Username:</strong> <code style="background: #f1f3f4; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${testCredentials.username}</code></p>
                <p style="margin: 10px 0;"><strong>Password:</strong> <code style="background: #f1f3f4; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${testCredentials.password}</code></p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${appUrl}/login" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">🌐 Login to CRM</a>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0; color: #856404;"><strong>⚠️ Security Notice:</strong> Please keep these credentials secure and consider changing your password after your first login.</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e9ecef; margin: 30px 0;">
            
            <p style="color: #6c757d; font-size: 14px; text-align: center; margin: 0;">
                This email was sent by the Zoho CRM System<br>
                If you have any questions, please contact your system administrator.
            </p>
        </div>
    </body>
    </html>`;

    console.log('\n📤 Sending credential email...');
    
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['mayureshsamel5@gmail.com'],
      subject: '🎉 Welcome to Zoho CRM - Your Account is Ready!',
      html: htmlContent
    });

    if (error) {
      console.error('❌ Email failed:', error);
      return;
    }

    console.log('✅ Credential email sent successfully!');
    console.log('📧 Email ID:', data.id);
    console.log('📧 Recipient: mayureshsamel5@gmail.com');
    console.log('\n🔐 Credentials sent:');
    console.log('Username:', testCredentials.username);
    console.log('Password:', testCredentials.password);
    console.log('Role:', roleDisplayName);
    console.log('Login URL:', `${appUrl}/login`);
    
    console.log('\n📬 Check your Gmail inbox for the credential email!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

sendCredentialEmail();