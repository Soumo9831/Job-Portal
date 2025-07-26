// controllers/user.controller.js

import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// REGISTER FUNCTION
export const register = async (req, res) => {
  try {
    const { fullname, email, password, phoneNumber, role } = req.body;

    if (!fullname || !email || !password || !phoneNumber || !role) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required.'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User already existing'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username: fullname,
      email,
      password: hashedPassword,
      phoneNumber,
      role
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      userId: newUser._id
    });

  } catch (err) {
    console.error('Registration error:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error'
    });
  }
};

// LOGIN FUNCTION
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and role are required.'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found. Please register first.'
      });
    }

    if (user.role !== role) {
      return res.status(403).json({
        success: false,
        error: `This email is registered as a ${user.role}. Please login as ${user.role}.`
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials. Please try again.'
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Send token via cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      userId: user._id,
      role: user.role
    });

  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error'
    });
  }
};

// LOGOUT FUNCTION
export const logout = async (req, res) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      maxAge: 0
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error'
    });
  }
};

// UPDATED PROFILE FUNCTION
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized. Please login first.'
      });
    }

    // Extract profile fields and uploaded file URLs from req.body
    const { bio, skills, resume, resumeOriginalName, company, profilePhoto } = req.body;

    const updatedFields = {
      ...(bio && { "profile.bio": bio }),
      ...(skills && { "profile.skills": skills }),
      ...(resume && { "profile.resume": resume }), // resume should be URL from Cloudinary
      ...(resumeOriginalName && { "profile.resumeOriginalName": resumeOriginalName }),
      ...(company && { "profile.company": company }),
      ...(profilePhoto && { "profile.profilePhoto": profilePhoto }) // profilePhoto URL from Cloudinary
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      updatedProfile: updatedUser.profile
    });

  } catch (err) {
    console.error('Profile update error:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error'
    });
  }
};
