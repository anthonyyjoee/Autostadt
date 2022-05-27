const express = require('express')
const app = express()
const port = 3000
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
        secure: true,
        sameSite: true 
    }
  }))

app.use(routes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})