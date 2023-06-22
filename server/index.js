const express = require('express');
const { config } = require('dotenv');
const { Configuration, OpenAIApi } = require('openai');
const mongoose = require('mongoose');

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

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.API_KEY,
  })
);

app.use(cors()); // This allows all origins to access your server

app.use(express.json());

// Import and use the routes
const routes = require('./routes/index');
app.use('/api', routes);

const port = process.env.PORT || 2121;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
