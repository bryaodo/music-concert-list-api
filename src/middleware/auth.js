const jwt = require('jsonwebtoken')
const User = require('../models/user')

/**
 * handles user authorization for logging in and performing actions
 * @param {HTTP request function to middleware} req 
 * @param {HTTP response function to middleware} res 
 * @param {callnacl argument to middleware} next 
 */
const auth = async (req, res, next) => {
    try {

        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET) //decode password with secret
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }) //find a user in database

        if (!user) { //if not found, throw error
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch (e) { //failure to authenticate
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth