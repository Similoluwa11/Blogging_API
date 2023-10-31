const express = require('express');
const middleware = require('../auth')
const blogController = require('./blog.controller');
const BlogModel = require('../models/blog.model');
const logger = require('../logger')

const router = express.Router();
router.get('/', blogController.getAllPublishedBlogs);

router.use('/user-blogs', async (req, res, next) => {

    const token = req.cookies.jwt;

    if (token) {
        try {
            const decodedValue = await jwt.verify(token, process.env.JWT_SECRET);
            console.log(decodedValue)
            res.locals.user = decodedValue
            
           
            next()
        } catch (error) {
            res.redirect('home')
        }
    } else {
        res.render('home')
    }
})
router.get('/user-blogs', blogController.getUsersBlogs)
router.post('/create-blog', blogController.createBlog)
router.post('/:id/publish', blogController.updateBlogState)

module.exports = router