const mongoose = require('mongoose');
const comments = require('../models/comments')

const listSchema = mongoose.Schema({
  title: String,
  about: String,
  items: [String],
  popularity: Number,
  comments: [{
    name: String,
    content: String
  }]
});

/*const commentSchema = mongoose.Schema({
  name: String,
  content: String
})*/

const List = mongoose.model('List', listSchema);
//const comment = mongoose.model('comment', commentSchema);

let id;

exports.create = function(req, res) {
  let userList = new List({
    title: req.body.title,
    about: req.body.about,
    items: req.body.items,
    popularity: 1,
    comments: {
      name: "first guy",
      content: "first"
    }
  })

  id = userList._id;

  userList.save(function(err, userList) {
    if (err) return console.error(err);
    res.redirect('/list/' + id)
  })
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
        comments:data.comments
    });
    for(i in data.comments) {
      console.log("panda")
    }
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

exports.comment = function(req, res) {
  const query = {"_id":id};
  let update = {$push:{'comments':({
    name: req.body.name,
    content: req.body.content
  })}};
  List.findOneAndUpdate(query, update, {new: true}, function(err, update) {
    if(err)
      return console.error(err);
    else {
      res.redirect('/list/' + id)
    }
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
