const express = require('express');
const cookieParser = require('cookie-parser');
 const blogController = require('../blogs/blog.controller')

require('dotenv').config();


const router = express.Router();

router.use(cookieParser())



router.get('/signup', (req, res) => {
    res.render('signup')
});
router.get('/login', (req, res) => {
    res.render('login', { user: res.locals.user || null });
})
router.get('/create-blog', (req, res) => {
    res.render('create-blog', 
    { user: res.locals.user });
})
router.get('/existingUser', (req, res) => {
    res.render('existingUser');
})
router.get('/invalidLoginInfo', (req, res) => {
    res.render('invalidLoginInfo');
})
router.get('/userNotFound', (req, res) => {
    res.render('userNotFound');
})
router.post('/logout', (req, res) => {    
    res.clearCookie('jwt')
    res.render('blogs')
});
module.exports = router