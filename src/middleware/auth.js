const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = (req, res, next) => {
    let token = ''
    if (req.header('Authorization')) {
        token = req.header('Authorization').replace('Bearer ', '')
    }
    
    if (!token) {
        return res.status(401).send({
            error: 'Unauthorized',
            message: 'No token provided in the request.'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
        if (error) {
            return res.status(401).send({
                error: 'Unauthorized',
                message: 'Failed to authenticate token.'
            })
        }

        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!user) {
            return res.status(401).send({
                error: 'Unauthorized',
                message: 'Token has expiered.'
            })
        }

        req.user = user
        req.token = token
        next()
    })
}

module.exports = auth