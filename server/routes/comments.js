const blog = require('../models/posts_model')
exports.addComment = (req, res) => {
  console.log(req.body)
  const comment = {user:req.body.body.user,comm:req.body.body.comm}
  console.log(comment)
  const q = blog.updateOne({ id: req.params.postId },
    { '$push': { 'comments': { $each:[comment] , $position: 0}} }
  )
  q.exec((err, docs) => {
    if (err)console.log(err)
    if (docs.nModified === 1) { return res.sendStatus(200) } else { return res.sendStatus(401) }
  })
}
