const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const routes = require('./routes')
const session = require('express-session')

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))

app.use(express.static(__dirname));

app.use('/static', express.static('static'))

app.use(session({
    secret: 'listrik',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        sameSite: true 
    }
  }))

app.use(routes)

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})