require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
    console.log('Testing Email Configuration...');
    console.log('User:', process.env.SMTP_USER);
    // Mask password
    console.log('Pass:', process.env.SMTP_PASS ? '********' : 'MISSING');

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error('❌ Missing SMTP credentials in .env');
        return;
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    try {
        console.log('Verifying connection...');
        await transporter.verify();
        console.log('✅ Connection successful!');

        console.log('Sending test email...');
        const info = await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.SMTP_USER, // Send to self
            subject: 'Test Email from Portfolio',
            text: 'If you see this, your email configuration is working correctly!',
            html: '<h3>Success!</h3><p>Your email configuration is working correctly.</p>'
        });

        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
    } catch (error) {
        console.error('❌ Email failed:', error);
    }
}

testEmail();
