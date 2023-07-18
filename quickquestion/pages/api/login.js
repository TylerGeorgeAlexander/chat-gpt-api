// pages/api/login.js

import { login } from '../../controllers/auth';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;

      // Call the login function from the controller
      const authToken = await login(email, password);

      // Login successful
      res.status(200).json({ message: 'Login successful', authToken });
    } catch (error) {
      console.error('Error in user login:', error);
      res.status(500).json({ error: 'An error occurred during login' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
