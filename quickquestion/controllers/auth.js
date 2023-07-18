import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Controller function for user registration
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Return success response
    res.status(200).json({ message: 'User registration successful' });
  } catch (error) {
    console.error('Error in registering user:', error);
    res.status(500).json({ error: 'An error occurred during user registration' });
  }
};

// Controller function for user login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // User not found
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    // Password does not match
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Password matches, user authenticated
    // Generate a JWT token
    const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Set the token expiration time as desired
    });

    // Send the authToken to the frontend
    res.status(200).json({ message: 'Login successful', authToken });
  } catch (err) {
    console.error('Error in logging in:', err);
    res.status(500).json({ error: 'An error occurred during login' });
  }
};

// Controller function for user logout
export const logout = (req, res) => {
  req.logout(); // Logout the user using Passport.js

  // TODO: remove This will not work on the server side since localStorage is a browser feature.
  // The server doesn't have access to the client's localStorage.
  // You don't really need to do anything special to logout a user with JWT - just make the client remove the token from local storage.

  // Clear the authToken stored in localStorage
  // localStorage.removeItem('authToken');

  res.status(200).json({ message: 'Logout successful' });
};

// Controller function to get user profile
export const getUserProfile = (req, res) => {
  const userId = req.userId; // Assuming you have middleware that extracts the authenticated user's ID

  // Find the user by ID
  User.findById(userId, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'An error occurred while fetching user profile' });
    }

    // User not found
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user profile
    res.status(200).json({ user });
  });
};