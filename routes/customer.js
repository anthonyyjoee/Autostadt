const { Customer } = require('../controllers/customer')
const router = require('express').Router()


router.get('/topup', Customer.topup)

router.post('/topup', Customer.postTopup)

router.get('/itemDetail/:id', Customer.itemDetail)

router.post('/itemDetail/:id', Customer.buy)




module.exports = router