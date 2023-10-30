const BlogModel = require('../models/blog.model');
const logger = require('../logger')

const getAllPublishedBlogs = async (req, res) => {
    try {
      
      const { page = 1, limit = 20, author, title, tags, order } = req.query;
  
      const filter = { state: 'published' };
  
      if (author) {
        filter.author = author;
      }
  
      if (title) {
        filter.title = { $regex: title, $options: 'i' }; 
      }
  
      if (tags) {
        filter.tags = { $in: tags.split(',') };
      }
  
      const sort = {};

    if (order) {
      if (order === 'read_count') {
        sort.read_count = 1;
      } else if (order === 'reading_time') {
        sort.reading_time = 1;
      } else if (order === 'timestamp') {
        sort.timestamp = 1;
      }
    } else {
      // Default order by timestamp if no order parameter is provided
      sort.timestamp = 1;
    }
  
      const blogs = await BlogModel.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(Number(limit));
        
  
      logger.info(`List of published blogs requested with parameters: ${JSON.stringify(req.query)}`);
      logger.info(`Response: ${JSON.stringify(blogs)}`);
  
      return {
        code: 200,
        success: true,
        message: 'Blogs fetched successfully',
        data: {
            blogs
        }
    }
    } catch (error) {
      logger.error(`Error in fetching list of published blogs: ${error.message}`);
      res.status(500).json({ message: 'An error occurred while fetching published blogs' });
    }
  }
  const createBlog = async (req, res) => {
    try {

      const { title, description, tags, body } = req.body;
      const author = req.user._id; 
      const wordsPerMinute = 200; 
      const readingTime = calculateReadingTime(body, wordsPerMinute);
  
      const blog = await BlogModel.create({
        title,
        description,
        tags,
        author,
        body,
        reading_time: readingTime
      });
  
      
      logger.info(`Blog created: ${blog.title} by ${blog.author}`);
  
      return res.status(201).json(blog);
    } catch (error) {
    
      logger.error(`Blog creation failed: ${error.message}`);
      res.status(500).json({ message: 'Blog creation failed' });
    }
  }
  const updateBlogState = async (req, res) => {
    try {
      const blogId = req.params.id;
      const userId = req.user._id;
  
      const blog = await BlogModel.findById(blogId);
  
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
  
      if (blog.author.toString() !== userId) {
        return res.status(403).json({ message: 'Permission denied' });
      }
  
      blog.state = 'published';
      await blog.save();
  
      logger.info(`Blog "${blog.title}" published by ${userId}`);
  
      return res.status(200).json(blog);
    } catch (error) {
      logger.error(`Failed to publish the blog: ${error.message}`);
      res.status(500).json({ message: 'Failed to publish the blog' });
    }
  }
  const editBlog = async (req, res) => {
    try {
      const blogId = req.params.id;
      const userId = req.user._id;

      const blog = await BlogModel.findById(blogId);
  
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
  
      if (blog.author.toString() !== userId) {
        return res.status(403).json({ message: 'Permission denied' });
      }
  
      blog.title = req.body.title;
      blog.description = req.body.description;
      blog.tags = req.body.tags;
      blog.body = req.body.body;
  
      await blog.save();
  
      logger.info(`Blog "${blog.title}" edited by ${userId}`);
  
      return res.status(200).json(blog);
    } catch (error) {
      logger.error(`Failed to edit the blog: ${error.message}`);
      res.status(500).json({ message: 'Failed to edit the blog' });
    }
  }
  const deleteBlog = async (req, res) => {
    try {
      const blogId = req.params.id;
      const userId = res.locals.user._id;

      const blog = await BlogModel.findById(blogId);
  
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
  
      if (blog.author.toString() !== userId) {
        return res.status(403).json({ message: 'Permission denied' });
      }
  
      await Blog.findByIdAndDelete(blogId);
  
      logger.info(`Blog "${blog.title}" deleted by ${userId}`);
  
      return res.status(204).end();
    } catch (error) {
      logger.error(`Failed to delete the blog: ${error.message}`);
      res.status(500).json({ message: 'Failed to delete the blog' });
    }
  }
  const getOneBlog = async (req, res) => {
    try {
      const blogId = req.params.id;
  
      const blog = await BlogModel.findById(blogId);
  
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
  
      blog.read_count += 1;
      await blog.save();
  
      const author = await User.findById(blog.author);
  
      const blogWithAuthor = {
        _id: blog._id,
        title: blog.title,
        description: blog.description,
        tags: blog.tags,
        author: author,
        timestamp: blog.timestamp,
        state: blog.state,
        read_count: blog.read_count,
        reading_time: blog.reading_time,
        body: blog.body,
      };
  
      logger.info(`Single blog requested: ${blog.title}`);
      logger.info(`Response: ${JSON.stringify(blogWithAuthor)}`);
  
      return res.status(200).json(blogWithAuthor);
    } catch (error) {
      logger.error(`Failed to fetch the blog: ${error.message}`);
      res.status(500).json({ message: 'Failed to fetch the blog' });
    }
  }
  module.exports = {
    getAllPublishedBlogs,
    createBlog,
    updateBlogState,
    getOneBlog,
    deleteBlog,
    editBlog
  }