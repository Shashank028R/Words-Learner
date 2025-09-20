const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyToken } = require("../middleware/auth");

// CHANGED: The path now correctly points to your 'words' folder.
const allWordsData = require('../words/words1.json'); 

// ================= Get all days =================
router.get("/", verifyToken, async (req, res) => {
    try {
        const dayKeys = Object.keys(allWordsData);
        
        const days = dayKeys.map(dayKey => ({
            day: parseInt(dayKey),
            label: `Day ${dayKey}`,
        }));

        res.json({ days });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// ================= Get words for a specific day =================
router.get("/:day", verifyToken, async (req, res) => {
    try {
        const dayKey = req.params.day;
        const words = allWordsData[dayKey];

        if (!words) {
            return res.status(404).json({ message: "No words found for this day." });
        }

        res.json({ day: parseInt(dayKey), words });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// ================= Mark word as read =================
router.put("/mark", verifyToken, async (req, res) => {
    try {
        const { day, word } = req.body;

        if (!day || !word)
            return res.status(400).json({ message: "Day and word are required" });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        let progressDay = user.progress.find((d) => d.day === day);
        if (!progressDay) {
            progressDay = { day, wordsRead: [], completed: false };
            user.progress.push(progressDay);
        }

        if (!progressDay.wordsRead.includes(word)) {
            progressDay.wordsRead.push(word);
        }

        const wordsForDay = allWordsData[day] || [];
        if (progressDay.wordsRead.length >= wordsForDay.length) {
            progressDay.completed = true;
        }

        await user.save();
        res.json({ message: "Word marked as read", progress: progressDay });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;