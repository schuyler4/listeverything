const mongoose = require('mongoose');
const comments = require('../models/comments')

const listSchema = mongoose.Schema({
  title: String,
  about: String,
  items: [String],
  popularity: Number,
  comment: {
    name: String,
    content: String
  }
});

const List = mongoose.model('List', listSchema)

let id;

exports.create = function(title, about, items) {
  let userList = new List({
    title: title,
    about: about,
    items: items,
    popularity: 1
  })

  userList.save(function(err, userList) {
    if (err) return console.error(err);
    res.redirect('/list/' + id)
  })
}

exports.comment = function(req, res) {
  let userComment = new List.comment ({
    name: req.body.name,
    content: req.body.content
  });

  userComment.save(function(err, save) {
    if (err) return console.error(err);
    res.redirect('/list/' + id)
  });
}

exports.all = function(data) {
  List.find({}, data)
}

exports.get = function(req, res) {
  id = req.params.id;

  List.findById(id, function(err, data) {
    if (err)
      return console.error(err);
    else
      res.render('list', {
        title: data.title,
        about: data.about,
        items:data.items,
        popularity:data.popularity,
        id:data.id
    });
  });

}

exports.like = function(req, res) {

  let query = {"_id":id};
  let update ={$inc:{popularity:1}};

  List.findOneAndUpdate(query, update, {new: true}, function(err, update) {
    if(err)
      return console.error(err);
    res.redirect('/list/' + id)
  });
}

exports.dislike = function(req, res) {

  let query = {"_id":id};
  let update ={$inc:{popularity:-1}};

  List.findOneAndUpdate(query, update, {new: true}, function(err, update) {
    if(err)
      return console.error(err);
    res.redirect('/list/' + id)
  });
}

exports.getEdit = function(req, res) {
  id = req.params.id

  List.findById(id, function(err, data) {
    if (err)
      return console.error(err);
    else
      res.render('editList', {
        title: data.title,
        about: data.about,
        items:data.items,
        id:data.id
      });
  });
}

exports.update = function(req, res) {
  let query = {"_id":id};
  let update = {$set:{items:req.body.items}};

  List.findOneAndUpdate(query, update, {new: true}, function(err, update) {
    if(err)
      return console.error(err);
    else
      res.redirect("/list/"+id);
  });
}

exports.delete = function(req, res) {
  let query = {"_id":id};
  let update = {$pull:{'items':{title:"test title"}}}
  List.findOneAndUpdate(query, update, {new: true}, function(err, remove) {
    if(err)
      return console.error(err);
    else {
      res.redirect("/list/"+id)
    }
  })
}

exports.home = function(req, res) {
  List.find({}).sort({'popularity':-1}).limit(10).exec(function(err, data) {
    res.render('home',{
      id:data.id,
      title:data.title,
      data:data,
      popularity:data.popularity
    });
  });
}
