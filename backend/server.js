require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Phone, Facebook } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Connect to Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err));

// --- AUTHENTICATION ROUTE ---
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    
    if (!user) return res.status(400).json({ error: "User not found" });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.assignedName }, 
      process.env.JWT_SECRET
    );
    
    // Here is the updated line sending the userId to the frontend!
    res.json({ token, role: user.role, name: user.assignedName, userId: user._id });
  } catch (error) {
    res.status(500).json({ error: "Server Error during login" });
  }
});

// --- DATA COLLECTION ROUTES ---
// Add Phone Number
app.post('/api/phones', async (req, res) => {
  const { number, userId, userName } = req.body;
  
  // Basic Validation
  const pattern = /^(?:\+88)?01[3-9]\d{8}$/;
  if (!pattern.test(number)) return res.status(400).json({ error: "Invalid BD Number" });

  try {
    const newPhone = new Phone({ number, addedBy: userId, addedByName: userName });
    await newPhone.save();
    res.json({ message: "Phone added successfully!" });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ error: "Duplicate Number Found!" });
    res.status(500).json({ error: "Server Error" });
  }
});

// Add Facebook Link
app.post('/api/facebook', async (req, res) => {
  const { link, userId, userName } = req.body;
  
  if (!link.includes('facebook.com')) return res.status(400).json({ error: "Invalid Facebook Link" });

  try {
    const newFb = new Facebook({ link, addedBy: userId, addedByName: userName });
    await newFb.save();
    res.json({ message: "Link added successfully!" });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ error: "Duplicate Link Found!" });
    res.status(500).json({ error: "Server Error" });
  }
});







// --- ADMIN ROUTES ---

// 1. Fetch all phone numbers
app.get('/api/phones', async (req, res) => {
  try {
    const phones = await Phone.find().sort({ createdAt: -1 }); // Newest first
    res.json(phones);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch phones" });
  }
});

// 2. Fetch all Facebook links
app.get('/api/facebook', async (req, res) => {
  try {
    const links = await Facebook.find().sort({ createdAt: -1 });
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch links" });
  }
});

// 3. Create a new "Boy" (General User)
app.post('/api/users', async (req, res) => {
  const { username, password, assignedName } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: "Username already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      role: 'general',
      assignedName
    });

    await newUser.save();
    res.json({ message: "User created successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
});











// --- USER MANAGEMENT ROUTES ---

// 1. Fetch all general users (for the Admin to see)
app.get('/api/users', async (req, res) => {
  try {
    // We only fetch 'general' users, and we DO NOT send their passwords back
    const users = await User.find({ role: 'general' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// 2. Delete a user
app.delete('/api/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// 3. Change Password
app.put('/api/users/password', async (req, res) => {
  const { userId, newPassword } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update password" });
  }
});






// 3. Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));