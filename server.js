if(process.env.NODE_ENV !== 'procution'){
    require('dotenv').config()
}

const express = require("express")
const app = express()
const expressLayouts = require("express-ejs-layouts")
const bodyParser = require('body-parser')

const indexRouter = require('./routes/index')//refers to the index.js file
const userRouter = require('./routes/users')//refers to the users.js file


//using EJS layouts for html rendering
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))

//connecting with mongodb
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser : true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', error => console.log('connetion succesful'))


app.use('/', indexRouter)
app.use('/users', userRouter)//for the user directory

app.listen(process.env.PORT || 3000)