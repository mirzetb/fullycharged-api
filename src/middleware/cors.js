const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', '*')

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.status(200).send()
    }
    else {
        next()
    }
}

module.exports = allowCrossDomain
