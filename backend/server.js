const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// DB Connection Fix
let isConnected = false;
const connectDatabase = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

// Uploads dir
const uploadsDir = process.env.VERCEL ? '/tmp/uploads' : path.join(__dirname, 'uploads');

try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (e) {
  console.log('Uploads dir not writable (serverless)');
}

app.use('/uploads', express.static(uploadsDir));

// Public health routes
app.get('/', (req, res) => {
  res.json({
    message: 'Portfolio API is running',
    health: '/api',
  });
});

app.get('/api', (req, res) => {
  res.json({ message: 'Portfolio API is running' });
});

app.use(async (req, res, next) => {
  await connectDatabase();
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/experience', require('./routes/experience'));
app.use('/api/education', require('./routes/education'));
app.use('/api/achievements', require('./routes/achievements'));
app.use('/api/contacts', require('./routes/contacts'));

// Local server
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
