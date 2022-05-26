const { Controller } = require('../controllers/controller')
const express = require('express')
const router = express.Router()
const seller = require('./seller')
const customer = require('./customer')

const midd = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login?errors=please login First')
    }
    console.log(req.session);
    next()
}


router.get('/', Controller.landingPage)

router.get('/register', Controller.registerPage)

router.post('/register', Controller.registerPost)

router.get('/login', Controller.loginPage)

router.post('/login', Controller.loginPost)

router.use(midd)

// after login
router.get('/home', Controller.home)

router.get('/account', Controller.account)

router.post('/account', Controller.saveEditedAccount)

router.get('/logout', Controller.logout)

router.use('/customer', customer)

router.use('/seller', seller)




module.exports = router