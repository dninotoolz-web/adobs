const express = require('express')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const path = require("path")
var port = process.env.PORT || 8080
var app = express()
const route = require('./routes/route')
const cors = require('cors');
require('dotenv').config();


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(flash())
app.use(cookieParser())
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', route)


app.listen(port, () => {
   console.log("Node server is runing in $s", port)
})

