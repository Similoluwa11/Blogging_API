const express = require('express');
const middleware = require('../auth')
const blogController = require('./blog.controller');
const BlogModel = require('../models/blog.model');
const logger = require('../logger')
const jwt = require('jsonwebtoken');

const router = express.Router();
router.get('/', blogController.getAllPublishedBlogs);
router.get('/blogs/:id', blogController.getOneBlog);

router.get('/user-blogs', async (req, res, next) => {

  const token = req.cookies.jwt;

  if (token) {
      try {
          const decodedValue = await jwt.verify(token, process.env.JWT_SECRET);
          console.log(decodedValue)
          res.locals.user = decodedValue
          
         
          next()
      } catch (error) {
          console.log(error)
          res.redirect('blogs')
      }
  } else {
      res.render('blogs')
  }
},blogController.getUsersBlogs)
router.post('/create-blog', async (req, res, next) => {

  const token = req.cookies.jwt;

  if (token) {
      try {
          const decodedValue = await jwt.verify(token, process.env.JWT_SECRET);
          console.log(decodedValue)
          res.locals.user = decodedValue
          
         
          next()
      } catch (error) {
          console.log(error)
          res.redirect('user-blogs')
      }
  } else {
      res.render('user-blogs')
  }
}, blogController.createBlog)

router.post('/update-state/:id/published', async (req, res, next) => {

  const token = req.cookies.jwt;

  if (token) {
      try {
          const decodedValue = await jwt.verify(token, process.env.JWT_SECRET);
          console.log(decodedValue)
          res.locals.user = decodedValue
          
         
          next()
      } catch (error) {
          console.log(error)
          res.redirect('user-blogs')
      }
  } else {
      res.render('user-blogs')
  }
}, blogController.updateBlogState)
router.get('/edit-blog/:id', async (req, res, next) => {

  const token = req.cookies.jwt;

  if (token) {
      try {
          const decodedValue = await jwt.verify(token, process.env.JWT_SECRET);
          console.log(decodedValue)
          res.locals.user = decodedValue
          
         
          next()
      } catch (error) {
          console.log(error)
          res.redirect('user-blogs')
      }
  } else {
      res.render('user-blogs')
  }
}, blogController.editBlog)
router.post('/delete-blog/:id', async (req, res, next) => {

  const token = req.cookies.jwt;

  if (token) {
      try {
          const decodedValue = await jwt.verify(token, process.env.JWT_SECRET);
          console.log(decodedValue)
          res.locals.user = decodedValue
          
         
          next()
      } catch (error) {
          console.log(error)
          res.redirect('user-blogs')
      }
  } else {
      res.render('user-blogs')
  }
}, blogController.deleteBlog)

module.exports = router