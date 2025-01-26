const express = require("express");
const router = express.Router();
const Subscription = require("../models/Subscription");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // NeureX email
    pass: process.env.EMAIL_PASS, // Email password or app-specific password
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

    // Send thank you email to the user
    const mailOptionsUser = {
      from: process.env.EMAIL_USER, // NeureX email
      to: email, // Subscriber email
      subject: "Thank You For Subscribing!",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <img src="https://your-logo-url.com/neurex-logo.png" alt="NeureX Logo" style="display: block; max-width: 200px; margin: 0 auto 20px;" />
          <h2 style="text-align: center; color: #007bff;">Thank You for Subscribing to NeureX!</h2>
          <p>Hi there,</p>
          <p>We're thrilled to have you on board. Stay tuned for the latest tools, updates, and innovations from NeureX. We truly appreciate your support!</p>
          <p>Follow us on social media for the latest updates:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="https://facebook.com/NeureX" style="margin: 0 10px;">
              <img src="https://your-icons-url.com/facebook-icon.png" alt="Facebook" style="width: 40px; height: 40px;" />
            </a>
            <a href="https://twitter.com/NeureX" style="margin: 0 10px;">
              <img src="https://your-icons-url.com/twitter-icon.png" alt="Twitter" style="width: 40px; height: 40px;" />
            </a>
            <a href="https://linkedin.com/company/NeureX" style="margin: 0 10px;">
              <img src="https://your-icons-url.com/linkedin-icon.png" alt="LinkedIn" style="width: 40px; height: 40px;" />
            </a>
          </div>
          <p style="text-align: center; color: #555;">&copy; ${new Date().getFullYear()} NeureX. All rights reserved.</p>
        </div>
      `,
    };

    // Send notification email to NeureX
    const mailOptionsNeurex = {
      from: process.env.EMAIL_USER, // NeureX email
      to: process.env.EMAIL_USER, // NeureX email
      subject: "New Subscriber Alert",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="text-align: center; color: #007bff;">New Subscriber Notification</h2>
          <p>A new user has subscribed to NeureX:</p>
          <ul>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Subscription Date:</strong> ${new Date().toLocaleString()}</li>
          </ul>
          <p style="text-align: center; color: #555;">&copy; ${new Date().getFullYear()} NeureX. All rights reserved.</p>
        </div>
      `,
    };

    // Send emails
    transporter.sendMail(mailOptionsUser, (error) => {
      if (error) {
        console.error("Error sending user email:", error);
        return res.status(500).json({ error: "Subscription succeeded, but email sending failed." });
      }

      // Send notification email to NeureX after user email is sent
      transporter.sendMail(mailOptionsNeurex, (err) => {
        if (err) {
          console.error("Error sending NeureX email:", err);
          return res.status(500).json({ error: "User subscribed, but NeureX notification failed." });
        }

        console.log("Emails sent successfully");
        res.status(200).json({
          message: "Subscribed successfully! A confirmation email has been sent.",
        });
      });
    });
  } catch (err) {
    console.error("Error subscribing:", err);
    res.status(500).json({ error: "An internal server error occurred" });
  }
});

module.exports = router;
