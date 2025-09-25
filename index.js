const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const cors = require('cors');
require('dotenv').config();

const route = require('./routes/route');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(flash());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', route);

// Start server
app.listen(port, () => {
    console.log(`Node server is running on port ${port}`);
});
