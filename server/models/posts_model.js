const mongoose = require('mongoose')
let BlogSchema = mongoose.Schema({
  id: Number,
  name: String,
  email: String,
  date: String,
  BlogImage: { data: Buffer, contentType: String },
  text: String,
  comments: [{ user: String,
    comm: String }]
})
// Store blog documents in a collection called "blogs"
let blog = mongoose.model('blogs', BlogSchema)
module.exports = blog
