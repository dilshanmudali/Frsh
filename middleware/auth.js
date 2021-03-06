const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function(req,res,next) {
    //get token from header
    const token = req.header('x-auth-token')
    const secret = config.get('jwtSecret')
    //check if no token
    if(!token) {
        return res.status(401).json({msg: 'No token, authorization denied'})
    }

    
    //veryify token
    try {
        const decoded = jwt.verify(token, secret)
        req.user = decoded.user
        next()
    } catch (err) {
        res.status(401).json({msg: 'Invalid Token!'})
    }
}