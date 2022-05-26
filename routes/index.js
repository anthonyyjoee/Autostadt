const express = require('express')
const { Controller } = require('../controllers/controller')
const router = express.Router()


// router.use((req, res, next) => {
//   console.log('Time: ', Date.now())
//   next()
// })

// landing page
router.get('/', Controller.landingPage)

// registerPage
router.get('/register', Controller.registerPage)
router.post('/register', Controller.registerPost)

// loginPage
router.get('/login', Controller.loginPage)
router.post('/login', Controller.loginPost)

router.use((req, res, next) => {
    if (!req.session.username) {
        return res.redirect('/login?errors=please login First')
    }
    console.log(req.session);
    next()
})

router.get('/home', Controller.home)

router.get('/addItem', Controller.addItem)


module.exports = router