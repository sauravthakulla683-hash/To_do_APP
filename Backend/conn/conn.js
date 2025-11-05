const mongoose = require("mongoose");
const conn = async (req, res) => {
  try {
    await mongoose
      .connect(
        "mongodb+srv://saurabhthakulla6_db_user:kftngj4JcSMVAaYl@saurav.efyymev.mongodb.net/"
      )
      .then(() => {
        console.log("connected");
      });
  } catch (err) {
    res.send("Error Not connected");
    console.log("Not connected");
  }
};
conn();
