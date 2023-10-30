const express = require('express');
const userRouter = require('./users/user.router')
const blogRouter = require('./blogs/blog.router')
require('dotenv').config();
const PORT = process.env.PORT
const db = require('./db');

const app = express()

app.use(express.json()) 
app.use(express.urlencoded({ extended: true })); 
db.connect();


app.use('/users', userRouter)
app.use('/blogs', blogRouter)



app.get('*', (req, res) => {
    return res.status(404).json({
        data: null,
        error: 'Route not found'
    })
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
        data: null,
        error: 'Server Error'
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
module.exports = app;