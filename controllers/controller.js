const { User, Profile, Item } = require('../models')
const currencyFormatter = require('currency-formatter');
const bcrypt = require('bcryptjs');
const creatingRupiah = require('../helper/helps')


class Controller {
    static landingPage(req, res) {
        res.render('landingPage')
    }

    static registerPage(req, res) {
        const { errors } = req.query
        res.render('register', { errors })
    }

    static registerPost(req, res) {
        let {firstname, lastname, username, password, role} = req.body
        const profileErrors = "Firstname is required and only accept letter input"

        if (firstname === "" || /\d/.test(firstname)) {
            return res.redirect(`/register?errors=${profileErrors}`)
        }
        if (/\d/.test(lastname)) {
            return res.redirect(`/register?errors=${profileErrors.replace('Firstname', 'Lastname')}`)
        }

        User.findOne({ where: { username: username }})
            .then(data => {
                if (data) throw new Error('username is already exists')
                return User.create({ username, password, role })
            })
            .then((data) => {
                return Profile.create({ firstname, lastname, UserId: data.id })
            })
            .then(() => res.redirect('/login'))
            .catch(err => {
                if (err.name === "SequelizeValidationError") {
                    const errors = err.errors.map(el => el.message).join().replaceAll(',', '\n')
                    return res.redirect(`/register?errors=${errors}`)
                }
                res.redirect(`/register?errors=${err.message}`)
            })
    }

    static loginPage(req, res) {
        const { errors } = req.query
        res.render('login', {errors})
    }

    static loginPost(req, res) {
        const {username, password} = req.body

        User.findOne({ where: { username: username } })
            .then(data => {
                if (data) {
                    const { id, username, role } = data
                    const isValidPass = bcrypt.compareSync(password, data.password)

                    if(isValidPass) {
                        req.session.user = {id, username, role}
                        return res.redirect('/home')
                    }
                }
                res.redirect('/login?errors=Invalid password or username')
            })
            .catch(err => res.send(err))
    }       

    static home(req, res) {
        const userId = req.session.user.id
        const userRole = req.session.user.role
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
        const data = {}

        Item.findAll(itemOpt)
            .then(dataItem => {
                data.items = dataItem
                return Profile.findByPk(userId)
            })
            .then(isLoginUserdata => {
                const items = data.items
                res.render('login/home', {isLoginUserdata, userRole, currencyFormatter, items, creatingRupiah, Item})
            })
            .catch(err => res.send(err))
    }

    static account(req, res) {
        const userId = req.session.user.id
        const userRole = req.session.user.role
        const option = {
            include: Profile,
            where: { id: userId } 
        }

        User.findAll(option)
            .then((data) => {
                data = data[0]
                res.render('login/account', { data, userRole })
            })
            .catch(err => res.send(err))
    }

    static saveEditedAccount(req, res) {
        const { firstname, lastname, username } = req.body
        const userId = req.session.user.id
        const userOption = { where: { id: userId } }
        const profileOption = { where: { UserId: userId } }

        User.update({ username }, userOption)
            .then(() => {
                return Profile.update({ firstname, lastname }, profileOption)
            })
            .then(() => res.redirect('/home'))
            .catch(err => res.send(err))
    }

    static logout(req, res) {
        req.session.destroy(err => {
            if (err) return res.send(err);
            res.redirect('/')
        })
    }
}

module.exports = { Controller }