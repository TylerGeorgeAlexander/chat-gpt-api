// pages/api/logout.js

import { logout } from '../../controllers/auth';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Call the logout function from the controller
      await logout();

      // Logout successful
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Error in user logout:', error);
      res.status(500).json({ error: 'An error occurred during logout' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
