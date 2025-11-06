const router = require("express").Router();
const User = require("../models/user");
const List = require("../models/list");
const user = require("../models/user");

router.post("/addtask", async (req, res) => {
  try {
    const { title, email, body } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new list item
    const newList = new List({ title, email, body, user: user._id });
    await newList.save();

    // Add reference to user's list
    user.list.push(newList._id);
    await user.save();

    res.status(200).json({ message: "Task added successfully", task: newList });
  } catch (error) {
    console.log("Error in list router:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/updatetask/:id", async (req, res) => {
  try {
    const { title, body } = req.body;
    const { id } = req.params;

    const user = await List.findOneAndUpdate(
      { _id: id },
      { title: title, body: body },
      { new: true }
    );
    if (user) {
      return res.status(200).json({ message: "Updated Title and body" });
    }
  } catch (error) {
    console.log("Error in list router:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//delete
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const delteTasks = await List.findByIdAndDelete(id);
    if (!delteTasks) {
      return res.status(404).json({ message: "Task not found" });
    }
    const removetask = await User.findByIdAndUpdate(delteTasks.user, {
      $pull: { list: delteTasks._id },
    });

    res.status(200).json({ message: "Delete Tasked succedfully" });
  } catch (error) {
    console.log("Error in list router:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get tasks
router.get("/gettasks", async (req, res) => {
  try {
    const { email } = req.query;

    const user = await User.findOne({ email }).populate({
      path: "list",
      options: { sort: { createdAt: -1 } }, // 👈 newest first
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Tasks fetched successfully",
      tasks: user.list,
    });
  } catch (error) {
    console.log("Error in gettasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
