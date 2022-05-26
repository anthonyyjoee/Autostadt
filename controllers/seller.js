const { User, Profile, Item } = require('../models')
const fs = require('fs')
const creatingRupiah = require('../helper/helps')

class Seller {  
    static addItem(req, res) {
        const userRole = req.session.user.role
        const {errors} = req.query
        res.render('login/seller/addItem', {userRole, errors})
    }

    static saveNewItem(req, res) {
        const userData = req.session.user
        const SellerId = userData.id
        const { name, price, stock, description, category } = req.body
        const photo = req.file.path
        

        Item.create({ name, price, stock, description, category, SellerId, photo })
            .then((data) => res.redirect('/seller/items'))
            .catch(err => {
                if (err.name ==='SequelizeValidationError') {
                    let errors = err.errors.map(el => {
                        return el.message
                    }).join()
                    return res.redirect(`/seller/addItem?errors=${errors}`)
                }
                console.log(err)
            })
    }

    static viewItems(req, res) {
        const userData = req.session.user
        const userRole = req.session.user.role
        const userId = userData.id
        const option = { where: { SellerId: userId } }

        Item.findAll(option)
            .then(data => res.render('login/seller/viewItems', { data, creatingRupiah, Item, userRole }))
            .catch(err => res.send(err))
    }

    static editItem(req, res) {
        const itemId = req.params.id
        const userRole = req.session.user.role
        const {errors} = req.query
        Item.findByPk(itemId)
            .then(data => res.render('login/seller/editItem', { data, userRole, errors }))
            .catch(err => res.send(err))
    }

    static saveEditedItem(req, res) {
        const itemId = req.params.id
        const { name, price, stock, description, category } = req.body
        const option = {where: { id: itemId } }
        
        Item.update({ name, price, stock, description, category }, option)
            .then(() => res.redirect('/seller/items'))
            .catch(err => {
                if (err.name ==='SequelizeValidationError') {
                    let errors = err.errors.map(el => {
                        return el.message
                    }).join()
                    return res.redirect(`/seller/item/${itemId}/edit?errors=${errors}`)
                }
                console.log(err)
            })
    }

    static deleteItem(req, res) {
        const itemId = req.params.id

        Item.findByPk(itemId)
            .then(data => {
                if (data) {
                    fs.unlinkSync(`./${data.photo}`)
                    return Item.destroy({ where :{ id: itemId } })
                }
                else {
                    throw new Error('no data')
                }
            })
            .then(() => res.redirect('/seller/items'))
            .catch(err => res.redirect(`/seller/items?errors=${err}`))
    }
}


module.exports = { Seller }