const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());

// Enable CORS for all origins
app.use(cors({ origin: "*" }));

const PORT = process.env.PORT || 5000;

// Routes
const registerRoute = require("./routes/register");
const sendEmailRoute = require("./routes/sendEmail");
const subscribeRoute = require("./routes/subscribe");

app.use("/api/register", registerRoute);
app.use("/api/sendEmail", sendEmailRoute);
app.use("/api/subscribe", subscribeRoute);

// Check MongoDB connection status and show appropriate message
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB connected successfully.");
    // Start the server only if MongoDB is connected
    app.listen(PORT, () => {
      console.log(`🚀 Server running successfully on port ${PORT}`);
      console.log("🌐 Visit: http://localhost:" + PORT);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    console.log("❌ Server not started due to database connection failure.");
    process.exit(1); // Exit with failure
  });

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("⚠️ An error occurred:", err.stack);
  res.status(500).send({ error: "An internal server error occurred." });
});

// Default route for health check or base endpoint
app.get("/", (req, res) => {
  if (mongoose.connection.readyState === 1) {
    res.send({
      message: "Welcome to the API!",
      status: "MongoDB connected and server running successfully",
      routes: {
        register: "/api/register",
        sendEmail: "/api/sendEmail",
        subscribe: "/api/subscribe",
      },
    });
  } else {
    res.status(503).send({
      message: "MongoDB not connected. Service unavailable.",
    });
  }
});
