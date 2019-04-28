const Blog = require('../models/posts_model')
exports.getPosts = (req, res) => {
  const q = Blog.find({})
  q.exec((err, docs) => {
    if (err)console.log(err)
    return res.json(docs)
  })
}
exports.addPost = (req, res) => {
  console.log(req.body)
  const newblog = new Blog({
    id: req.body.id,
    name: req.body.name,
    email: req.body.email,
    date: req.body.date,
    url: req.body.url,
    text: req.body.text
  })
  newblog.save((err, docs) => {
    console.log(docs)
    if (err)console.log(err)
    else {
      return res.json({ status: 'success' })
    }
  })
}
