const express = require('express');
const middleware = require('../auth')
const blogController = require('./blog.controller');

const router = express.Router();
router.get('/', async (req,res) => {
    const response = await blogController.getAllPublishedBlogs
    res.render('blogs', { 
     blogs: response.data
    });
})
router.get('/:id', async (req,res) => {
    const response = await blogController.getOneBlog
    res.render('blog-details', { 
        blog: response
       });
})

router.post('/', middleware.authUser,  blogController.createBlog)
router.put('/:id/publish', blogController.updateBlogState)

module.exports = router