const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const logger = require('../logger')

require('dotenv').config()

const Signin =  async ({username, password}) => {
  try {
      const userFromRequest = {username, password}
  
      const user = await UserModel.findOne({
          username: userFromRequest.username,
      });
  
      if (!user) {
          return {
          message: 'User not found',
          code: 400 }
      }
  
      const validPassword = await user.isValidPassword(userFromRequest.password)
  
      if (!validPassword) {
          return {
              message: 'Username or password is not correct',
              code: 422,
          }
      }
  
      const token = await jwt.sign({ username: user.username, _id: user._id}, 
          process.env.JWT_SECRET, 
          { expiresIn: '1h' })
          logger.info(`User authenticated: ${user.username}`);
          return {
              message: 'Login successful',
              code: 200,
              data: {
                  user,
                  token
              }
          }
  } catch (error) {
    logger.error(`Authentication failed: ${error.message}`);
      return {
          message: 'Server Error',
          data: null
      }
  }
}
  const Signup = async ({username, email, password, firstname, lastname}) => {
    try {
        const userFromRequest = {username, email, password, firstname, lastname};
        console.log(userFromRequest)
        const existingUser = await UserModel.findOne({
            email: userFromRequest.email
        });
    
        if (existingUser) {
            return {
                message: 'User with that email already exists',
                code: 400
            };
        }
    
        const user = await UserModel.create({
            username: userFromRequest.username,
            password: userFromRequest.password,
            email: userFromRequest.email,
            firstname: userFromRequest.firstname,
            lastname: userFromRequest.lastname
        });
    
        const token = await jwt.sign({ username: user.username, _id: user._id}, process.env.JWT_SECRET, { expiresIn: '1h' })
        logger.info(`User registered: ${user.username}`);
        return {
            message: 'User Created Successfully',
            code: 201,
            data: {
                token
            }
        }
    } catch (error) {
      logger.error(`Registration failed: ${error.message}`);
        return res.status(500).json({
            message: 'Server Error',
            data: null
        })
    }

}
  
  module.exports = {
    Signin,
    Signup
  }