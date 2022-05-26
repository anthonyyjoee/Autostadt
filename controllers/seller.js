const { User, Profile, Item } = require('../models')

class Seller {  
    static addItem(req, res) {
        const userRole = req.session.user.role
        res.render('login/seller/addItem', {userRole})
    }

    static saveNewItem(req, res) {
        const userData = req.session.user
        const SellerId = userData.id
        const { name, price, stock, description, category } = req.body
        const photo = req.file.path

        Item.create({ name, price, stock, description, category, SellerId, photo })
            .then((data) => res.redirect('/seller/items'))
            .catch(err => res.send(err))
    }

    static viewItems(req, res) {
        const userData = req.session.user
        const userId = userData.id
        const option = { where: { SellerId: userId } }

        Item.findAll(option)
            .then(data => res.render('login/seller/viewItems', { data }))
            .catch(err => res.send(err))
    }

    static editItem(req, res) {
        const itemId = req.params.id
        const userRole = req.session.user.role

        Item.findByPk(itemId)
            .then(data => res.render('login/seller/editItem', { data, userRole }))
            .catch(err => res.send(err))
    }

    static saveEditedItem(req, res) {
        const itemId = req.params.id
        const { name, price, stock, description, category } = req.body
        const option = {where: { id: itemId } }
        
        Item.update({ name, price, stock, description, category }, option)
            .then(() => res.redirect('/seller/items'))
            .catch(err => res.send(err))
    }

    static deleteItem(req, res) {
        const itemId = req.params.id

        Item.destroy({ where :{ id: itemId } })
            .then(() => res.redirect('/seller/items'))
            .catch(err => res.send(err))
    }
}


module.exports = { Seller }