const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    progress: [
        {
            day: Number,
            wordsRead: [String], // store word IDs or actual words
            completed: { type: Boolean, default: false }
        }
    ],
    streak: { type: Number, default: 0 },
    badges: [String] // array of badge names
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
