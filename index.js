// index.js
require('dotenv').config(); // Load env first

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const cors = require('cors');

const route = require('./routes/route');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(flash());
app.use(cors());

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', route);

// Global error handler (optional but useful)
app.use((err, req, res, next) => {
  console.error('Unexpected error:', err);
  res.status(500).send({ response: 'server-error', error: err.message });
});

// Start server
app.listen(port, (err) => {
  if (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
  console.log(`✅ Node server is running on port ${port}`);
});
