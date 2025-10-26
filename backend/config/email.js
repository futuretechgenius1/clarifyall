const nodemailer = require('nodemailer');

// Email configuration
// In production, use environment variables for credentials
const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Send email function
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"Clarifyall" <${emailConfig.auth.user}>`,
      to,
      subject,
      html
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Email templates
const emailTemplates = {
  // Welcome email
  welcome: (name) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Clarifyall! 🎉</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>Thank you for joining Clarifyall - your ultimate AI tool directory!</p>
          <p>You can now:</p>
          <ul>
            <li>✅ Submit your favorite AI tools</li>
            <li>✅ Save and bookmark tools</li>
            <li>✅ Track your submissions</li>
            <li>✅ Build your profile</li>
          </ul>
          <p>Start exploring thousands of AI tools today!</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="button">Explore Tools</a>
        </div>
        <div class="footer">
          <p>© 2024 Clarifyall. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  
  // Email verification
  verification: (name, token) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .code { background: #fff; padding: 15px; border: 2px dashed #667eea; border-radius: 5px; font-size: 18px; font-weight: bold; text-align: center; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Verify Your Email 📧</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>Please verify your email address to activate your Clarifyall account.</p>
          <p>Click the button below to verify:</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}" class="button">Verify Email</a>
          <p>Or copy and paste this link in your browser:</p>
          <div class="code">${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}</div>
          <p><small>This link will expire in 24 hours.</small></p>
        </div>
        <div class="footer">
          <p>If you didn't create an account, please ignore this email.</p>
          <p>© 2024 Clarifyall. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  
  // Password reset
  passwordReset: (name, token) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Reset Your Password 🔐</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>We received a request to reset your password for your Clarifyall account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}" class="button">Reset Password</a>
          <div class="warning">
            <strong>⚠️ Security Notice:</strong>
            <p>This link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
          </div>
        </div>
        <div class="footer">
          <p>© 2024 Clarifyall. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
};

module.exports = {
  sendEmail,
  emailTemplates
};
