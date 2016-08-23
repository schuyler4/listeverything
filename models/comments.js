/*const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const list = require('../models/list')

const commentSchema = mongoose.Schema({
  name: String,
  content: String,
  pageid: String,
  date: { type : Date, default: Date.now }
});

const comment = mongoose.model('comment', commentSchema);

let title;

exports.get = function(req, res) {
  id = req.params.id;
  console.log(id)
  /*comment.find({pageid:id}, function(err, data) {
    console.log(data)
    /*console.log(data)
    if (err) return console.error(err);
    res.render({name:data.name, content:data.content});
  });
}

exports.create = function(req, res) {
  let userComment = new comment({
    name: req.body.name,
    content: req.body.content,
    pageid: id,
    date: new Date()
  });

  userComment.save(function(err, save) {
    if (err) return console.error(err);
    res.redirect('/list/' + id)
  });
}*/
