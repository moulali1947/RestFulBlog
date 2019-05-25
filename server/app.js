var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var app = express()
var cors = require('cors')
require('dotenv').config()
// mongoose connection
const mongoose = require('mongoose')
let uri = process.env.MONGODB_URI
mongoose.connect(uri)
let db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', console.log.bind(console, 'Connected to DB'))

// allowing cors
app.use(cors())
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

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

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
