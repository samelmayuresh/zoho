#!/usr/bin/env node

/**
 * Real SMS Testing Script
 * 
 * This script tests actual SMS sending using Twilio.
 * Make sure to update your .env.local with real credentials before running.
 */

require('dotenv').config({ path: '.env.local' });

const twilio = require('twilio');

async function testRealSMS() {
  try {
    console.log('📱 REAL SMS Testing with Twilio')
    console.log('================================')
    console.log('✅ Twilio Account SID: [CONFIGURED]')
    console.log('✅ Twilio Phone: [CONFIGURED]')
    console.log('📞 Update the phone number in this script to your real number')
    
    // Initialize Twilio client
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // Update this to your real phone number for testing
    const testPhoneNumber = '+1234567890'; // Replace with your actual number
    
    const message = await client.messages.create({
      body: 'Test SMS from Zoho CRM System! 🚀',
      from: process.env.TWILIO_PHONE_NUMBER,
      to: testPhoneNumber
    });

    console.log('✅ SMS sent successfully!');
    console.log('📱 Message SID:', message.sid);
    console.log('📞 Sent to:', testPhoneNumber);
    
  } catch (error) {
    console.error('❌ SMS sending failed:', error.message);
    
    if (error.code === 20003) {
      console.log('💡 Make sure your Twilio credentials are correct');
    } else if (error.code === 21211) {
      console.log('💡 Invalid phone number format. Use international format (+1234567890)');
    }
  }
}

// Run the test
testRealSMS();