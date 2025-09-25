const express = require('express')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const path = require("path")
const cors = require('cors')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 8080
const route = require('./routes/route')

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(flash())
app.use(cookieParser())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', route)

// Health-check
app.get('/ping', (req, res) => {
  res.status(200).send({ status: 'ok', message: 'Server is running 🚀' })
})

// Start server
app.listen(port, () => {
   console.log(`🚀 Node server is running on port ${port}`)
})
