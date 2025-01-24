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
    from: `"${firstName} ${lastName} <${email}> via ${process.env.EMAIL_USER}"`, // Show user's email as "From"
    replyTo: email, // Reply goes to user's email
    to: "neurex7@gmail.com", // Your email
    subject: `Contact Form Submission from ${firstName} ${lastName}`,
    text: `You have a new message from your website contact form:\n\n
    Name: ${firstName} ${lastName}\n
    Email: ${email}\n
    Message:\n${message}`,
  };

  // Thank you email to the user
  const userMailOptions = {
    from: `"NeureX Agent" <${process.env.EMAIL_USER}>`, // From your official email
    to: email, // Send to user's email
    subject: "Thank You for Contacting Us!",
    text: `Dear ${firstName} ${lastName},\n\n
    Thank you for reaching out to us! We have received your message and will get back to you as soon as possible.\n\n
    Your Message:\n${message}\n\n
    Best regards,\n
    NeureX Agent\n
    Support Team`,
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
