const mongoose = require('mongoose');
const ValidationError = mongoose.Error.ValidationError;
const ValidatorError  = mongoose.Error.ValidatorError;
const comments = require('../models/comments');
const text = require('../text')

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

let used = false;

function redirect(req, res) {
  res.redirect('/addList')
}

let title;
let id;
let session;

exports.warning = function(req, res) {
  req.flash('titleWarning', text.textWarning)
  res.redirect('/addList');
}

exports.addPage = function(req, res) {
  if(session) {
    res.render('addList',{title: session.title, about: session.about,
      items: session.items, warning: req.flash('titleWarning')});
    console.log(req.flash('titleWarning'));
    console.log(session.items);
  }
  else {
    res.render('addList');
  }
}

exports.create = function(req, res) {

  session = req.session;
  session.title = req.body.title;
  session.about = req.body.about;
  session.items = req.body.items;

  let userList = new List({
    title: req.body.title,
    about: req.body.about,
    items: req.body.items,
    popularity: 1,
    comments:[]
  })

  List.findOne({title: userList.title}, 'title', function(err, title) {
    if(err) {
      console.error(err);
    }
    else if(title) {
      res.redirect('/addList')
    }
    else {
      userList.save(function(err, userList) {
        if (err) {
          console.error(err);
        } else {
          req.session.destroy();
          title = userList.title;
          id = userList.id;
          res.redirect('/list/' + title + '/' + id);
        }
      });
    }
  });
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
