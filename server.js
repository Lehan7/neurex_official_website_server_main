const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({origin: '*'}));

const PORT = process.env.PORT || 5000;

// Routes
const registerRoute = require("./routes/register");
const sendEmailRoute = require("./routes/sendEmail");
const subscribeRoute = require("./routes/subscribe");

app.use("/api/register", registerRoute);
app.use("/api/sendEmail", sendEmailRoute);
app.use("/api/subscribe", subscribeRoute);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("An error occurred:", err.stack);
  res.status(500).send({ error: "An internal server error occurred." });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
