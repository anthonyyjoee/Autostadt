const { User, Profile } = require('../models')
const bcrypt = require('bcryptjs')


class Controller {
    static landingPage(req, res) {
        res.render('landingPage')
    }

    static registerPage(req, res) {
        const { errors } = req.query
        res.render('register', { errors })
        console.log(errors);
    }

    static registerPost(req, res) {
        const {firstname, lastname, username, password, role} = req.body
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
        res.render('login')
    }

    static loginPost(req, res) {
        const {username, password} = req.body

        User.findOne({ where: { username: username } })
            .then(data => {
                if (data) {
                    const isValidPass = bcrypt.compareSync(password, data.password)

                    if(isValidPass) {
                        req.session.username = data.username
                        return res.redirect('/home')
                    }
                }
                res.redirect('/login?errors=Invalid password or username')
            })
            .catch(err => res.send(err))
    }       

    static home(req, res) {
        res.render('home')
    }

    static addItem(req, res) {
        res.render('addItem')
    }
}

module.exports = { Controller }