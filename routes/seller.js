const { Seller } = require('../controllers/seller')
const router = require('express').Router()
const multer = require('multer')

// multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './assets')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

// multer middleware
const upload = multer({ storage: storage })

// add seller item
router.get('/addItem', Seller.addItem)
router.post('/addItem', upload.single('photo'), Seller.saveNewItem)

//view seller items
router.get('/items', Seller.viewItems)

// edit seller item
router.get('/item/:id/edit', Seller.editItem)
router.post('/item/:id/edit', Seller.saveEditedItem)

// delete seller item
router.get('/item/:id/delete', Seller.deleteItem)

module.exports = router