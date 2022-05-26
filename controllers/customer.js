const { User, Profile, Item, Transaction } = require('../models')
const creatingRupiah = require('../helper/helps')

class Customer {  
    static topup(req, res) {
        const userRole = req.session.user.role
        res.render('login/customer/topup', { userRole })
        console.log(req.session);
    }

    static postTopup(req, res) {
        const { money } = req.body
        const userId = req.session.user.id
        const option = { where: { UserId: userId } }

        Profile.increment({ money: money }, option)
            .then(() => res.redirect('/home'))
            .catch(err => res.send(err))
    }

    static itemDetail(req, res) {
        const itemId = req.params.id
        const userRole = req.session.user.role
        const { errors } = req.query
        const itemOpt = {
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            include: {
                model: User,
                attributes: ['id', 'username'],
                include: {
                    model:Profile,
                    attributes: ["firstname", "lastname"]
                }
            }
        }

        Item.findByPk(itemId, itemOpt)
            .then(data => res.render('login/customer/itemDetail', { data, errors, userRole, Item, creatingRupiah }))
            .catch(err => res.send(err))
    }

    static buy(req, res) {
        const userId = req.session.user.id
        const { itemId, price, stock, sellerId } = req.query
        
        Profile.findOne({
            where: {
                UserId: userId
            }
        })
            .then(data => {
                if(data.money < price) {
                    throw new Error('not enough balance')
                }
                if (+stock === 0) {
                    throw new Error('out of stock')
                }
                return Profile.increment({money: -price}, { where: { UserId: userId } })
            })
            .then(() => {
                return Item.increment({ stock: -1 }, { where: { id: itemId } })
            })
            .then(() => {
                return Profile.increment({ money: price }, { where: { UserId: sellerId } })
            })
            .then (() => {
                Transaction.create({ItemId: itemId, CustomerId: userId})
                res.redirect(`/home`)
            })
            .catch(err => {
                res.redirect(`/customer/itemDetail/${itemId}?errors=${err}`)
            })
    }

    static history(req, res) {
        const userId = req.session.user.id
        const userRole = req.session.user.role
        const option = { 
            include: {
                model: Item,
                attributes: ['name', "price", 'photo'],
            },
        }

        Transaction.findAll(option)
            .then(data => {
                console.log(data.Item);
                res.render('login/customer/history', { data, userRole })
            })
            .catch(err => res.send(err))
    }
}


module.exports = { Customer }