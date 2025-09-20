const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require("./routes/user.js");
require('dotenv').config();

const authRoutes = require('./routes/auth.js');
const coursesRoutes = require('./routes/courses.js');

const app = express();

// ✅ Middleware must come before routes
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api/user", userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));

// Test route
app.get('/', (req, res) => {
    res.setHeader('content-type', 'text/html');
    res.send('<h1>Learn Words Backend Running<h1>');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
