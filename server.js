const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();
app.use(cors());
app.use(express.json()); // parse JSON

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/ngoDB")
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));

// API: View all users (donors and volunteers)
app.get("/api/viewAll", async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// API: Add new user
app.post("/api/addNew", async (req, res) => {
    try {
        const { name, email, role, donationAmount } = req.body;
        const newUser = new User({
            name: name.trim(),
            email: email.trim(),
            role,
            donationAmount: role === "Donor" ? Number(donationAmount) : undefined
        });
        await newUser.save();
        res.json({ status: "User added successfully" });
    } catch(err) {
        if(err.code === 11000) {
            res.json({ status: `${req.body.email} already exists` });
        } else {
            res.json({ status: err.message });
        }
    }
});

// API: Delete user by ID
app.post("/api/deleteUser", async (req, res) => {
    const { id } = req.body;
    try {
        await User.findByIdAndDelete(id);
        res.json({ status: "User deleted successfully" });
    } catch(err) {
        res.json({ status: "Error deleting user" });
    }
});

// Test route
app.get("/", (req, res) => {
    res.send("Hello from NGO Node.js + MongoDB App!");
});

const PORT = 7000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
