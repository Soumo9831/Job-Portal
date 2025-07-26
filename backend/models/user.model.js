// models/user.model.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  role: {
    type: String,
    enum: ['student', 'recruiter'],
    required: true
  },
  profile: {
    bio: { type: String },
    skills: [{ type: String }],
    resume: { type: String },              // URL to resume file
    resumeOriginalName: { type: String },  // Original file name
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    profilePhoto: { type: String, default: "" } // Optional profile image URL
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
