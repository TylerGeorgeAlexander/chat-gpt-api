// pages/api/user/profile.js

import { getUserProfile } from '../../../controllers/auth';
import { verifyToken } from '../../../utils/auth';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Verify the token from the request headers
      const token = req.headers.authorization;
      const userId = verifyToken(token);

      // Call the getUserProfile function from the controller
      const userProfile = await getUserProfile(userId);

      // Return the user profile
      res.status(200).json({ userProfile });
    } catch (error) {
      console.error('Error in getting user profile:', error);
      res.status(500).json({ error: 'An error occurred while fetching user profile' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
