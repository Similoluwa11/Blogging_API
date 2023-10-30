const jwt = require('jsonwebtoken');
require('dotenv').config();
async function authUser(req, res, next) {
  const token = req.cookies.jwt

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token.' });
  }
}
module.exports = {authUser}
