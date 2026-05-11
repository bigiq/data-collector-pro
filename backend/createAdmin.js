require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('./models');

// Connect to the database
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Database connected.");

    // Check if admin already exists to prevent duplicates
    const existingAdmin = await User.findOne({ username: 'dataadmin' });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists!");
      process.exit();
    }

    // Hash the password for security
    const hashedPassword = await bcrypt.hash('dataCollect2024', 10);

    // Create the Admin User
    const adminUser = new User({
      username: 'dataadmin',
      password: hashedPassword,
      role: 'admin',
      assignedName: 'Wasib (Admin)'
    });

    await adminUser.save();
    console.log("🎉 Admin account created successfully!");
    console.log("Username: dataadmin");
    console.log("Password: dataCollect2024");
    process.exit();
  })
  .catch(err => {
    console.log("Database connection error:", err);
    process.exit(1);
  });