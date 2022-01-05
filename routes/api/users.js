const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const {check, validationResult} = require('express-validator')

// @route POST api/users
// @desc Register user
// @access public
router.post('/',[
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Input a valid Email').isEmail(),
    check('password', 'Please enter a passoword with 6 or more characters').isLength({min:6})
], async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    
    const {name, email, password} = req.body

    try {
        let user = await User.findOne({email})
        if(user){
            res.status(400).json({errors: [{msg: 'User already exists'}]})
        }

        const avatar = gravatar.url(email, {s: '200', r:'pg', d:'mm'})
        user = new User({
            name,
            email,
            avatar,
            password
        })
        //encrypt pass 
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)
        await user.save()
        //return jwt 
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn: 36000},
            (err,token) => {
                if(err) throw err;
                res.json({token})
            } 
        )
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
    
})

module.exports = router