const mongoose = require('mongoose');

// The User (Admin or the Boys)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  role: { type: String, enum: ['admin', 'general'], default: 'general' },
  assignedName: { type: String }, // So you know which boy entered the data
});

// The Phone Numbers
const phoneSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  addedByName: { type: String } 
}, { timestamps: true });

// The Facebook Links
const facebookSchema = new mongoose.Schema({
  link: { type: String, required: true, unique: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  addedByName: { type: String }
}, { timestamps: true });

module.exports = {
  User: mongoose.model('User', userSchema),
  Phone: mongoose.model('Phone', phoneSchema),
  Facebook: mongoose.model('Facebook', facebookSchema)
};