const express = require('express');
const path = require('path');
const { config } = require('dotenv');
const { Configuration, OpenAIApi } = require('openai');
const mongoose = require('mongoose');
const extractUserId = require('./middleware/authMiddleware')

// Load environment variables from .env file
config();

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-gpt-api';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Handle MongoDB connection events
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const cors = require('cors');
const app = express();

app.use(cors()); // This allows all origins to access your server

app.use(express.json());

// Middleware function to extract the user ID from the JWT token
// app.use(extractUserId);

// Import and use the routes
const routes = require('./routes/index');
app.use('/api', routes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

const port = process.env.PORT || 2121;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
