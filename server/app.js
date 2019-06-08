var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var app = express()
var cors = require('cors')
require('dotenv').config()
// import facebook authentication module
var auth = require('./controller/Auth')
// mongoose connection
const mongoose = require('mongoose')
let uri = process.env.MONGODB_URI
mongoose.connect(uri)
let db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', console.log.bind(console, 'Connected to DB'))

// allowing cors
app.use(cors())
// Invoking Facebook auth middleware for authenticating users.
app.use(auth)
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
// Routers to posts & comments
const postsRouter = require('./routes/posts.js')
const commentsRouter = require('./routes/comments')
// Posts API's
app.get('/posts', postsRouter.getPosts)
app.post('/posts', postsRouter.addPost)
// comments API's
app.post('/posts/:postId/comments', commentsRouter.addComment)

module.exports = app
