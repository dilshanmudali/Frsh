const express = require('express')
const router = express.Router()
const {check, validationResult} = require('express-validator')

// @route POST api/users
// @desc Register user
// @access public
router.post('/',[
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Input a valid Email').isEmail(),
    check('password', 'Please enter a passoword with 6 or more characters').isLength({min:6})
], (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    res.send('test user route')
})

module.exports = router