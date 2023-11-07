// pages/api/register.js

import { registerUser } from '../../controllers/auth';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { username, email, password } = req.body;

      // Call the registerUser function from the controller
      await registerUser(username, email, password);

      // Registration successful
      res.status(200).json({ message: 'User registration successful' });
    } catch (error) {
      console.error('Error in user registration:', error);
      res.status(500).json({ error: 'An error occurred during user registration' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
