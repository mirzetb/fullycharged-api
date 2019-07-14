const jwt = require('jsonwebtoken')
const { User, EVO, EVCP } = require('../models/user')

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

        let user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!user) {
            return res.status(401).send({
                error: 'Unauthorized',
                message: 'Token has expiered.'
            })
        }

        if (user.role == 'EVO') {
            user = await EVO.findOne({ _id: user._id })
            await user.populate('vehicleModel').execPopulate()
        }

        req.user = user
        req.token = token
        next()
    })
}

module.exports = auth