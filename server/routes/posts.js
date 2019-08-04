const Blog = require('../models/posts_model')
const path = require('path')
const multer = require('multer')
const fs = require('fs')

// multer methods for saving images on the server side.
const storage = multer.diskStorage({
  destination: 'public/images',
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }// path.extname(file.originalname)
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }
}).single('file')

exports.getPosts = (req, res) => {
  const q = Blog.find({})
  q.exec((err, docs) => {
    if (err) throw err
    return res.json(docs)
  })
}
exports.addPost = (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err)
    } else if (err) {
      return res.status(500).json(err)
    }
    const newblog = new Blog({
      id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      date: req.body.date,
      text: req.body.text
    })
    console.log('newblog', newblog)
    console.log('req.file', req.file)
    newblog.BlogImage.data = req.file.path
    newblog.BlogImage.contentType = 'image/png'
    newblog.save((err, docs) => {
      if (err)res.status(500).json(err)
      else {
        return res.json({ status: true })
      }
    })
  })
}
