const router = require("express").Router();
const User = require("../models/user");

//Sign IN
router.post("/register", async (req, res) => {
  try {
  } catch (error) {
    res.send("Error");
    console.log("Error");
  }
});

module.exports = router;
