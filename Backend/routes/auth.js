const router = require("express").Router();
const User = require("../models/user");

//Sign IN
router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const Exists = await User.findOne({ email });
    if (Exists) {
      console.log("User already Exists");
      res.send("Something Went erong (signup)");
      return;
    }
    const user = new User({ email, username, password });

    await user.save();
    res.status(200).json({ user: user });
  } catch (error) {
    res.send("Error");
    console.log("Error");
  }
});

module.exports = router;
