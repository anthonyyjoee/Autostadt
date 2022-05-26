const { User, Profile, Item } = require('../models')

class Customer {  
    static topup(req, res) {
        res.render('login/customer/topup')
        console.log(req.session);
    }

    static postTopup(req, res) {
        const { money } = req.body
        const userId = req.session.user.id
        const option = { where: { UserId: userId } }

        Profile.update({ money }, option)
            .then(() => res.redirect('/home'))
            .catch(err => res.send(err))
    }

    static itemDetail(req, res) {
        const itemId = req.params.id
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
            .then(data => res.render('login/customer/itemDetail', { data }))
            .catch(err => res.send(err))
    }

    static buy(req, res) {
        const userId = req.session.user.id
        const { itemId, price, stock, sellerId } = req.query
        
        User.findByPk(userId)
            .then(data => {
                if(data.money < price) {
                    throw new Error('not enough balance')
                }
                if (stock == 0) {
                    throw new Error('out of stock')
                }
                return Profile.increment({money: -price}, { where: { UserId: userId } })
            })
            .then(() => {
                return Item.increment({ stock: -1 }, { where: { id: itemId } })
            })
            .then(() => {
                Profile.increment({ money: price }, { where: { UserId: sellerId } })
                res.redirect(`/customer/itemDetail/${itemId}`)
            })
            .catch(err => res.send(err))
    }
}


module.exports = { Customer }