const express = require('express');
const cookieParser = require('cookie-parser');

require('dotenv').config();


const router = express.Router();

router.use(cookieParser())



router.get('/signup', (req, res) => {
    res.render('signup')
});
router.get('/login', (req, res) => {
    res.render('login', { user: res.locals.user || null });
})

router.post('/logout', (req, res) => {    
    res.clearCookie('jwt')
    res.render('home')
});
module.exports = router