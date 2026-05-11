require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('./models');

// Connect to the database
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Database connected.");

    // Check if admin already exists to prevent duplicates
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists!");
      process.exit();
    }

    // Hash the password for security
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create the Admin User
    const adminUser = new User({
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
      assignedName: 'Wasib (Admin)'
    });

    await adminUser.save();
    console.log("🎉 Admin account created successfully!");
    console.log("Username: admin");
    console.log("Password: admin123");
    process.exit();
  })
  .catch(err => {
    console.log("Database connection error:", err);
    process.exit(1);
  });