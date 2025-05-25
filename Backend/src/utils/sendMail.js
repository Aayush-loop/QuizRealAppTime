const nodemailer = require("nodemailer");
require("dotenv").config();


const email = process.env.EMAIL_USER;
const password = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass: password,
  },
});


const sendVerificationEmail = async (email, verificationToken) => {
  const currentYear = new Date().getFullYear();

  const mailOptions = {
    from: `Realtime Quiz <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Email Verification Code - Realtime Quiz",
    text: `Your verification code is: ${verificationToken}. This code will expire in 24 hours.`,
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification Code - Realtime Quiz</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;500;600&display=swap');
        
        body {
          font-family: 'Poppins', Arial, sans-serif;
          line-height: 1.6;
          color: #333333;
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
        }
        
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        }
        
        .email-header {
          background-color: #1a365d;
          color: #ffffff;
          padding: 30px 20px;
          text-align: center;
        }
        
        .quiz-name {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          margin: 0;
          letter-spacing: 1px;
        }
        
        .email-body {
          padding: 30px 40px;
        }
        
        .greeting {
          font-size: 20px;
          font-weight: 500;
          margin-bottom: 20px;
          color: #1a365d;
        }
        
        .message {
          margin-bottom: 30px;
          font-size: 16px;
        }
        
        .verification-code {
          background-color: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 6px;
          padding: 20px;
          text-align: center;
          margin: 25px 0;
        }
        
        .code {
          font-family: 'Courier New', monospace;
          font-size: 32px;
          font-weight: 700;
          letter-spacing: 5px;
          color: #1a365d;
          margin: 10px 0;
        }
        
        .expiry {
          font-size: 14px;
          color: #6c757d;
          margin-top: 10px;
        }
        
        .note {
          font-size: 14px;
          color: #6c757d;
          margin-top: 30px;
          font-style: italic;
        }
        
        .email-footer {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #6c757d;
          border-top: 1px solid #e9ecef;
        }
        
        .social-links {
          margin: 15px 0;
        }
        
        .social-link {
          display: inline-block;
          margin: 0 10px;
          color: #1a365d;
          text-decoration: none;
        }
        
        @media only screen and (max-width: 480px) {
          .email-body {
            padding: 20px;
          }
          
          .quiz-name {
            font-size: 24px;
          }
          
          .code {
            font-size: 24px;
            letter-spacing: 3px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1 class="quiz-name">Realtime Quiz</h1>
        </div>
        
        <div class="email-body">
          <p class="greeting">Hello,</p>
          
          <p class="message">Thanks for signing up for Realtime Quiz! To verify your email address and get started, please use the verification code below:</p>
          
          <div class="verification-code">
            <p>Your Verification Code</p>
            <p class="code">${verificationToken}</p>
            <p class="expiry">This code will expire in 24 hours</p>
          </div>
          
          <p class="message">If you did not create an account on Realtime Quiz, you can safely ignore this email.</p>
          
          <p class="message">Let's get quizzing! 🚀</p>
          
          <p class="note">This is an automated message. Please do not reply directly to this email.</p>
        </div>
        
        <div class="email-footer">
          <div class="social-links">
            <a href="#" class="social-link">Facebook</a>
            <a href="#" class="social-link">Instagram</a>
            <a href="#" class="social-link">Twitter</a>
          </div>
          <p>&copy; ${currentYear} Realtime Quiz. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
};
