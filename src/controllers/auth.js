const User = require('../models/user')

const login = async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
}

const register = async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()

        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
}

const me = async (req, res) => {
    res.send(req.user)
}

const logout = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token )
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
}

const logoutAll = async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
}

module.exports = {
    login,
    register,
    me,
    logout,
    logoutAll
}