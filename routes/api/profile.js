const express = require('express')
const router = express.Router()
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const auth = require('../../middleware/auth')

// @route GET api/profile
// @desc Test route
// @access public
router.get('/', (req,res) => res.send('test profile route'))

// @route GET api/me
// @desc get current user's profile
// @access private
router.get('/me', auth, async (req, res) => {
    try {
        profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar'])
        if(!profile){
            return res.status(400).json({msg: 'There is no profile for this user'})
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})


module.exports = router