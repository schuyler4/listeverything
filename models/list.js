const mongoose = require('mongoose');
const ValidationError = mongoose.Error.ValidationError;
const ValidatorError  = mongoose.Error.ValidatorError;
const comments = require('../models/comments');

const listSchema = mongoose.Schema({
  title: {
    type: String,
  },
  about: String,
  items: {
    type:[String],
    required: [true, 'Whats a list without items']
  },
  popularity: Number,
  comments:[String]
});

const List = mongoose.model('List', listSchema);

List.schema.pre("save", function(next) {
  var self = this;

  List.findOne({title : this.title}, 'title', function(err, results) {
      if(err) {
          next(err);
      } else if(results) {
          console.warn("title already used");
          self.invalidate("title", "title has already been used");
          console.log(self.invalidate)
          next(new Error("title has already been used"));
      } else {
          next();
      }
  });
});

let title;
let id;

exports.create = function(req, res) {

  let userList = new List({
    title: req.body.title,
    about: req.body.about,
    items: req.body.items,
    popularity: 1,
    comments:[]
  })

  userList.save(function(err, userList) {
    if (err) {
      console.error(err);
    } else {
      title = userList.title;
      id = userList.id;
      res.redirect('/list/' + title + '/' + id);
    }
  });
}

exports.getAdd = function(req, res) {
    if(session) {
      console.log(session.title);
      console.log(session.about);
      console.log(session.items);
      res.render('addList',{title: session.title, about: session.about,
        items: session.items})
    }
}

exports.all = function(data) {
  List.find({}, data)
}

exports.get = function(req, res) {
  title = req.params.title;
  id = req.params.id;

  List.findById(id, function(err, list) {
    if(err) {
      console.error(err);
    }
    else {
      console.log("saved sucksessfully")
      res.render('list', {
        title: list.title,
        about: list.about,
        items: list.items,
        popularity: list.popularity,
        comments: list.comments
      });
    }
  });
}

exports.like = function(req, res) {

  let query = {"_id":id};
  let update ={$inc:{popularity:1}};

  List.findOneAndUpdate(query, update, {new: true}, function(err, update) {
    if(err)
      return console.error(err);
    res.redirect('/list/' + title + '/' + id)
  });
}

exports.dislike = function(req, res) {

  let query = {"_id":id};
  let update ={$inc:{popularity:-1}};

  List.findOneAndUpdate(query, update, {new: true}, function(err, update) {
    if(err)
      return console.error(err);
    res.redirect('/list/' + title + '/' + id)
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
  let query = {"_id":id};
  let update = {$push:{comments:req.body.comment}};
  List.findOneAndUpdate(query, update, {new: true}, function(err, comment) {
    if(err)  {
        console.error(err);
    }
    else {
      res.redirect("/list/" + title + "/" + id)
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
