const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require("./models/Student");

const app = express();
app.use(cors());
app.use(express.json()); // parse JSON

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/college")
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));

// API: View all students
app.get("/api/viewAll", async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

// API: Add new student
app.post("/api/addNew", async (req, res) => {
    try {
        const { name, regno, cgpa } = req.body;
        const newStudent = new Student({
            name: name.trim(),
            regno: regno.trim(),
            cgpa: Number(cgpa)
        });
        await newStudent.save();
        res.json({ status: "Data Saved Successfully" });
    } catch(err) {
        if(err.code === 11000) {
            res.json({ status: `${req.body.name} already exists` });
        } else {
            res.json({ status: err.message });
        }
    }
});

// API: Delete student by ID
app.post("/api/deleteUser", async (req, res) => {
    const { id } = req.body;
    try {
        await Student.findByIdAndDelete(id);
        res.json({ status: "User deleted successfully" });
    } catch(err) {
        res.json({ status: "Error deleting user" });
    }
});

// Test Route
app.get("/", (req, res) => {
    res.send("Hello from Node + Express + MongoDB!");
});

const PORT = 7000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
