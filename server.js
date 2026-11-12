// server.js
require('dotenv').config(); // Load .env first
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');

const app = express();

// 1️⃣ Body parser
app.use(express.json());

// 2️⃣ Serve frontend files
app.use(express.static(path.join(__dirname, 'public')));

// 3️⃣ Connect to MongoDB
connectDB()
  .then(() => {
    // Register API routes only after DB is ready
    app.use('/api/auth', authRoutes);
    app.use('/api/notes', noteRoutes);

    // Fallback: any unknown route returns index.html (SPA behaviour)
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('Failed to start server because DB connection failed.', err);
    process.exit(1);
  });

