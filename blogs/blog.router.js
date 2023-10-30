const express = require('express');
const middleware = require('../auth')
const blogController = require('./blog.controller');

const router = express.Router();
router.get('/published-blogs',blogController.getAllPublishedBlogs)
router.get('/blogs/:id', blogController.getOneBlog)

router.post('/', middleware.authUser,  blogController.createBlog)
router.put('/blogs/:id/publish', blogController.updateBlogState)

module.exports = router