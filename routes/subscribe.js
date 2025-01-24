const express = require("express");
const router = express.Router();
const Subscription = require("../models/Subscription");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services like 'Yahoo', 'Outlook', etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

router.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if email already exists
    const existingSubscription = await Subscription.findOne({ email });
    if (existingSubscription) {
      return res.status(400).json({ error: "Email is already subscribed" });
    }

    const subscription = new Subscription({ email });
    await subscription.save();

    // Send thank you email
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email address
      to: email, // Recipient email address
      subject: "Thank You For Subscribing!",
      text: `Thank you for subscribing to NeureX! Stay tuned for new tools and updates. We appreciate your support!`,
      html: `<p>Thank you for subscribing to <strong>NeureX</strong>! Stay tuned for new tools and updates. We appreciate your support!</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Subscription succeeded, but email sending failed." });
      }
      console.log("Email sent:", info.response);
      res.status(200).json({ message: "Subscribed successfully! A confirmation email has been sent." });
    });
  } catch (err) {
    console.error("Error subscribing:", err);
    res.status(500).json({ error: "An internal server error occurred" });
  }
});

module.exports = router;
