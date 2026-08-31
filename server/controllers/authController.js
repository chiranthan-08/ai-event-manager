import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'ai-event-manager-secret-key-2026';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id.toString(), role: user.role, name: user.name, email: user.email, organizerId: user.organizerId || null },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const allowedRoles = ['employee', 'client'];
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role. Admin accounts cannot be created through registration.' });
    }
    const userRole = allowedRoles.includes(role) ? role : 'client';

    const user = await User.create({ name, email, password, role: userRole, profileImage: '', authProvider: 'local' });
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, organizerId: user.organizerId },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Block password login for Google-only accounts
    if (user.authProvider === 'google' && !user.password) {
      return res.status(401).json({ success: false, message: 'Please sign in with Google for this account' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, organizerId: user.organizerId },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// Secure Google Login - verifies ID token on server
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ success: false, message: 'Google credential is required' });
    }

    if (!GOOGLE_CLIENT_ID || !googleClient) {
      return res.status(500).json({ success: false, message: 'Google Client ID not configured on server. Set GOOGLE_CLIENT_ID in .env' });
    }

    // Verify ID token securely on backend
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture, email_verified } = payload;

    if (!email_verified) {
      return res.status(401).json({ success: false, message: 'Google email not verified' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user for first-time Google login - default role is client
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        googleId,
        authProvider: 'google',
        profileImage: picture || '',
        role: 'client',
        isActive: true,
      });
    } else {
      // Existing user - link googleId if not linked, update profile image if changed
      let needsSave = false;
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = user.authProvider || 'google';
        needsSave = true;
      }
      if (picture && user.profileImage !== picture) {
        user.profileImage = picture;
        needsSave = true;
      }
      if (needsSave) await user.save();
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, organizerId: user.organizerId, profileImage: user.profileImage },
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({ success: false, message: 'Google authentication failed: ' + error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, profileImage: user.profileImage, organizerId: user.organizerId, createdAt: user.createdAt },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, profileImage } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (email && email !== user.email) {
      const existing = await User.findOne({ email, _id: { $ne: user._id } });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      user.email = email;
    }
    if (req.body.phone !== undefined) user.phone = req.body.phone;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, profileImage: user.profileImage, organizerId: user.organizerId },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.authProvider === 'google' && !user.password) {
      return res.status(400).json({ success: false, message: 'Google accounts cannot change password. Please set a password first.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) {
      const safe = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { name: { $regex: safe, $options: 'i' } },
        { email: { $regex: safe, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
