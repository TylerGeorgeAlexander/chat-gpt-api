import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/User';
import { connectDB } from '../../utils/db';

const options = {
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        await connectDB();

        const { email, password } = credentials;

        // Find the user by email
        const user = await User.findOne({ email });

        // User not found or invalid password
        if (!user || !(await bcrypt.compare(password, user.password))) {
          throw new Error('Invalid credentials');
        }

        // Generate JWT token
        const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: '1h', // Set the token expiration time as desired
        });

        // Return the user object and token
        return { user, authToken };
      },
    }),
  ],
  callbacks: {
    async jwt(token, user) {
      // Add the user object to the JWT token
      if (user) {
        token.userId = user._id;
      }
      return token;
    },
    async session(session, token) {
      // Add the user ID to the session object
      session.userId = token.userId;
      return session;
    },
  },
};

export default (req, res) => NextAuth(req, res, options);
