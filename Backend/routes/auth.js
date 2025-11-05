const router = require("express").Router();
const User = require("../models/user");

//Sign IN
router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username, password });
    await user.save();
    res.status(200).json({ user: user });
  } catch (error) {
    res.send("Error");
    console.log("Error");
  }
});

module.exports = router;
