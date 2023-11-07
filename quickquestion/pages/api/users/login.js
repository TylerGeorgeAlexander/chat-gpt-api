// pages/api/users/login.js

import { login } from '../../../controllers/auth';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;

      // Call the login function from the controller
      const { authToken, error } = await login(email, password);

      if (error) {
        // Login failed
        res.status(401).json({ error: 'Invalid credentials' });
      } else {
        // Login successful
        res.status(200).json({ message: 'Login successful', authToken });
      }
    } catch (error) {
      console.error('Error in user login:', error);
      res.status(500).json({ error: 'An error occurred during login' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
