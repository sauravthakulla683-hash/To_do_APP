const express = require("express");
const cors = require("cors");
const app = express();

// Routes
const auth = require("./routes/auth");
const list = require("./routes/list");

// DB Connection
require("./conn/conn");

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Hello from Backend 🚀");
});

// API routes
app.use("/api/auth", auth);
app.use("/api/list", list);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
app.listen(1000, () => {
  console.log("✅ Server started at http://localhost:1000");
});
