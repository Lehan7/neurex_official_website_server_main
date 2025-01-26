const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

router.post("/", async (req, res, next) => {
  const { firstName, lastName, email, message } = req.body;

  // Validate input fields
  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER, // Authenticated sender email
      pass: process.env.EMAIL_PASS, // Authenticated sender password
    },
  });

  // Email to the website owner
  const ownerMailOptions = {
    from: `"${firstName} ${lastName} <${email}> via NeureX"`,
    replyTo: email,
    to: "neurex7@gmail.com",
    subject: `New Contact Form Message from ${firstName} ${lastName}`,
    html: `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
      .container { background-color: #f4f7f9; border-radius: 10px; padding: 20px; }
      .header { background-color: #0066cc; color: white; text-align: center; padding: 15px; border-radius: 10px 10px 0 0; }
      .content { background-color: white; padding: 20px; border-radius: 0 0 10px 10px; }
      .contact-details { background-color: #f0f4f8; padding: 15px; border-left: 4px solid #0066cc; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>New Website Contact Form Submission</h2>
      </div>
      <div class="content">
        <div class="contact-details">
          <h3>Sender Details:</h3>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        </div>
        
        <h3>Message:</h3>
        <blockquote style="border-left: 4px solid #0066cc; padding-left: 15px; font-style: italic;">
          ${message}
        </blockquote>
        
        <p style="text-align: right; color: #666; font-size: 12px;">
          Received: ${new Date().toLocaleString()}
        </p>
      </div>
    </div>
  </body>
  </html>
    `
  };

  // Thank you email to the user
  const userMailOptions = {
    from: `"NeureX Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Received: Your Message to NeureX, ${firstName}`,
    html: `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap');
      body { 
        font-family: 'Inter', Arial, sans-serif; 
        line-height: 1.6; 
        color: #1a2b3c; 
        background-color: #f4f7f9;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 15px 35px rgba(0,0,0,0.1);
        overflow: hidden;
      }
      .header {
        background: linear-gradient(135deg, #0066cc, #003366);
        color: white;
        text-align: center;
        padding: 20px;
      }
      .message-highlight {
        background: linear-gradient(135deg, #e6f2ff, #b3d9ff);
        border-left: 5px solid #0066cc;
        padding: 15px;
        margin: 20px 0;
        border-radius: 0 8px 8px 0;
        position: relative;
        overflow: hidden;
      }
      .message-highlight::before {
        content: '"';
        position: absolute;
        font-size: 100px;
        color: rgba(255,255,255,0.2);
        top: -30px;
        left: -10px;
        z-index: 1;
      }
      .message-content {
        position: relative;
        z-index: 2;
        font-style: italic;
        color: #003366;
      }
      .signature {
        text-align: right;
        font-weight: bold;
        margin-top: 10px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Message Received</h1>
      </div>
      <div style="padding: 20px;">
        <p>Dear ${firstName} ${lastName},</p>
        
        <p>We've received your message and our team is reviewing it with careful attention.</p>
        
        <div class="message-highlight">
          <div class="message-content">
            ${message}
          </div>
          <div class="signature">
            — ${firstName} ${lastName}
          </div>
        </div>
        
        <p>Our team will respond within 1-2 business days. We appreciate your communication.</p>
        
        <p>Best regards,<br>NeureX Support Team</p>
      </div>
    </div>
  </body>
  </html>
    `
  };

  try {
    // Send email to website owner
    await transporter.sendMail(ownerMailOptions);

    // Send thank you email to the user
    await transporter.sendMail(userMailOptions);

    res.status(200).json({ message: "Email sent successfully. A thank-you email has also been sent to the user." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

module.exports = router;
