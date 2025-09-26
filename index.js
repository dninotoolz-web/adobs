// index.js
const express = require('express');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const route = require('./routes/route');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(cookieParser());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', route);

// health endpoint for Railway to probe quickly
app.get('/health', (req, res) => {
  res.status(200).send({ status: 'ok', pid: process.pid });
});

const server = app.listen(port, () => {
  console.log(`Node server is running on port ${port} (pid=${process.pid})`);
});

// graceful shutdown handler
function shutdown(signal) {
  console.log(`Received ${signal}. Closing HTTP server...`);
  server.close(() => {
    console.log('HTTP server closed, exiting process.');
    process.exit(0);
  });

  // If still not closed after timeout, force exit
  setTimeout(() => {
    console.warn('Forcing process exit after 10s.');
    process.exit(1);
  }, 10000);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Catch unhandled exceptions/rejections and log them (but don't swallow)
process.on('uncaughtException', (err) => {
  console.error('uncaughtException:', err && err.stack ? err.stack : err);
  // allow platform to restart - exit after logging
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('unhandledRejection:', reason);
});
