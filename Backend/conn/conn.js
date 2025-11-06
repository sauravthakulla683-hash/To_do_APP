const mongoose = require("mongoose");

const conn = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://saurabhthakulla6_db_user:kftngj4JcSMVAaYl@saurav.efyymev.mongodb.net/"
    );
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.log("❌ MongoDB connection failed:", err.message);
  }
};

conn();
