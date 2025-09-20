const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyToken } = require("../middleware/auth");

// ================= Dashboard / Progress =================
router.get("/progress", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const progress = user.progress || [];

    res.json({
      user: {
        name: user.name,
        email: user.email,
        progress, // array of {day, wordsRead, completed}
        streak: user.streak || 0,
        badges: user.badges || [],
        totalWordsLearned: progress.reduce(
          (sum, day) => sum + (day.wordsRead?.length || 0),
          0
        ),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// ================= Profile Info =================
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      user: {
        name: user.name,
        email: user.email,
        streak: user.streak || 0,
        badges: user.badges || [],
        totalWordsLearned:
          user.progress?.reduce(
            (sum, day) => sum + (day.wordsRead?.length || 0),
            0
          ) || 0,
        coursesCompleted:
          user.progress?.filter((p) => p.completed).length || 0,
        profilePic: user.profilePic || null,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// ================= Update Profile Info =================
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { name, profilePic } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (profilePic) user.profilePic = profilePic;

    await user.save();

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
