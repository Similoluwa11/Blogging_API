const BlogModel = require('../models/blog.model');
const UserModel = require('../models/user.model');
const logger = require('../logger')

const getAllPublishedBlogs = async (req, res) => {
  try {
    const searchQuery = req.query.search || ''; 
    const sortBy = req.query.sort || 'timestamp'; 
    const page = parseInt(req.query.page, 10) || 1; 

    const query = {
      state: 'published',
    };

    if (searchQuery) {
      query.$or = [
        { author: { $regex: searchQuery, $options: 'i' } }, 
        { title: { $regex: searchQuery, $options: 'i' } },
        { tags: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    const blogsPerPage = 20;
    const skipCount = (page - 1) * blogsPerPage;

    let blogs = await BlogModel.find(query)
      .sort(sortBy)
      .skip(skipCount)
      .limit(blogsPerPage);

    res.render('blogs', { blogs, currentPage: page });
    logger.info(`List of published blogs requested with parameters: ${JSON.stringify(req.query)}`);
    logger.info(`Response: ${JSON.stringify(blogs)}`);
  } catch (error) {

  logger.error(`Error in fetching list of published blogs: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
}
const getUsersBlogs = async (req, res) => {
  try {
    const userId = res.locals.user._id;

    const page = parseInt(req.query.page, 10) || 1;
    const filterState = req.query.filterState || 'all'; 

    
    const query = { author: userId };

    if (filterState !== 'all') {
      query.state = filterState;
    }

    
    const blogsPerPage = 10; 
    const skipCount = (page - 1) * blogsPerPage;

    const userBlogs = await BlogModel.find(query)
      .sort({ timestamp: -1 }) 
      .skip(skipCount)
      .limit(blogsPerPage);

    
    const totalUserBlogs = await BlogModel.countDocuments(query);
    const totalPages = Math.ceil(totalUserBlogs / blogsPerPage);

    
    res.render('user-blogs', {
      userBlogs,
      currentPage: page,
      filterState,
      totalPages,
    });
    logger.info(`List of published blogs requested with parameters: ${JSON.stringify(req.query)}`);
    logger.info(`Response: ${JSON.stringify(userBlogs)}`);
  } catch (error) {
   
    logger.error(`Error in fetching list of your blogs: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
}
  const createBlog = async (req, res) => {
    try {
      
      const { title, description, tags, body } = req.body;
      const author = res.locals.user._id; 
      const wordsPerMinute = 200; 
      
      const words = body.split(" ");
      const wordsLength = words.length;
      const readingTime = Math.ceil(wordsLength / wordsPerMinute);
  
      const blog = await BlogModel.create({
        title,
        description,
        tags,
        author,
        body,
        reading_time: readingTime
      });
  
      
      logger.info(`Blog created: ${blog.title} by ${blog.author}`);
  
      return res.status(201).redirect('user-blogs');
    } catch (error) {
    
      logger.error(`Blog creation failed: ${error.message}`);
      res.status(500).json({ message: 'Blog creation failed' });
    }
  }
  const updateBlogState = async (req, res) => {
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
  
      blog.state = 'published';
      await blog.save();
  
      logger.info(`Blog "${blog.title}" published by ${userId}`);
  
      return res.status(200).redirect('user-blogs');
    } catch (error) {
      logger.error(`Failed to publish the blog: ${error.message}`);
      res.status(500).json({ message: 'Failed to publish the blog' });
    }
  }
  const editBlog = async (req, res) => {
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
  
      blog.title = req.body.title;
      blog.description = req.body.description;
      blog.tags = req.body.tags;
      blog.body = req.body.body;
  
      await blog.save();
  
      logger.info(`Blog "${blog.title}" edited by ${userId}`);
  
      return res.status(200).redirect('user-blogs');
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
  
      await BlogModel.findByIdAndDelete(blogId);
  
      logger.info(`Blog "${blog.title}" deleted by ${userId}`);
  
      return res.status(204).redirect('user-blogs');
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
  
      const author = await UserModel.findById(blog.author);
  
      const blogWithAuthor = {
        _id: blog._id,
        title: blog.title,
        description: blog.description,
        tags: blog.tags,
        author: author.username,
        timestamp: blog.timestamp,
        state: blog.state,
        read_count: blog.read_count,
        reading_time: blog.reading_time,
        body: blog.body,
      };
  
      logger.info(`Single blog requested: ${blog.title}`);
      logger.info(`Response: ${JSON.stringify(blogWithAuthor)}`);
  
      return res.status(200).render('blog-details', {blog});
    } catch (error) {
      logger.error(`Failed to fetch the blog: ${error.message}`);
      res.status(500).json({ message: 'Failed to fetch the blog' });
    }
  }
  module.exports = {
    getAllPublishedBlogs,
    getUsersBlogs,
    createBlog,
    updateBlogState,
    getOneBlog,
    deleteBlog,
    editBlog
  }