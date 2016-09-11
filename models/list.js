const mongoose = require('mongoose');
const async = require('async');
const ValidationError = mongoose.Error.ValidationError;
const ValidatorError  = mongoose.Error.ValidatorError;
const comments = require('../models/comments');
const text = require('../text')
const flash = require('connect-flash');

const listSchema = mongoose.Schema({
  title: {
    type: String,
  },
  about: String,
  items: [String],
  popularity: Number,
  comments:[String]
});

const List = mongoose.model('List', listSchema);

let used = false;
let session;

exports.addPage = function(req, res) {
  if(session) {
    res.render('addList',{title: session.title, about: session.about,
      items: session.items, warning: text.textWarning});
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
      throw err;
    }
    else if(title) {
      res.redirect('/addList')
    }
    else {
      userList.save(function(err, userList) {
        if (err) {
          return next(err);
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

exports.listOflists = function(req, res, next) {
  let query = {}
  let search = req.body.search;

  if(req.body.search) {
    query = {'title': new RegExp(search, "i")}
  }

  List.find(query, function(err, all) {
    if(err) {
      throw err;
    }
    else {
      res.render('listOflists',{
        data:all,
        title:all.title,
        search: search
      })
    }
  });
}

exports.get = function(req, res) {
  let title = req.params.title;
  let id = req.params.id;

  List.findById(id, function(err, list) {
    if(err) {
      throw err;
    }
    else {
      res.render('list', {
        title: list.title,
        about: list.about,
        items: list.items,
        popularity: list.popularity,
        comments: list.comments,
        id:list.id
      });
      const listItems = list.items;
      async.forEach(listItems, function(err, listItems) {
        if(err) {
          return next(err);
        }
      });
    }
  });
}

exports.like = function(req, res) {
  let id = req.body.id;
  let query = {"_id":id};
  let update ={$inc:{popularity:1}};

  List.findOneAndUpdate(query, update, {new: true}, function(err, update) {
    if(err) {
      throw err;
    }
    res.redirect('/list/'+ update.title + '/'+ id);
  });
}

exports.dislike = function(req, res) {
  let id = req.body.id;

  let query = {"_id":id};
  let update ={$inc:{popularity:-1}};

  List.findOneAndUpdate(query, update, {new: true}, function(err, update) {
    if(err) {
      throw err;
    }
    res.redirect('/list/' + update.title + '/' + id);
  });
}

exports.update = function(req, res) {
  let id = req.body.id;
  let query = {"_id":id};
  let update = {$push:{items:req.body.newItems}};

  List.findOneAndUpdate(query, update, {new: true}, function(err, update) {
    if(err) {
      throw err;
    }
    res.redirect("/list/"+update.title+'/'+id);
  });
}

exports.comment = function(req, res) {
  let id = req.body.id;
  let comment = req.body.comment;
  let query = {"_id":id};
  let update = {$push:{comments:req.body.comment}};
  List.findOneAndUpdate(query, update, {new: true}, function(err, update) {
    console.log("panda")
    if(err)  {
      return next(err);
    }
    res.redirect("/list/" + update.fsadfdsa + '/' +id);
  });
}

exports.getDelete = function(req, res) {
  let id = req.params.id;
  let title = req.params.title;

  List.findById(id, function(err, list) {
    if(err) {
      throw err;
    }
    else {
      res.render('delete', {
        title: list.title,
        items: list.items,
        id:list.id
      });
      const listItems = list.items;
      async.forEach(listItems, function(err, listItems) {
        if(err) {
          return next(err);
        }
      });
    }
  });
}

exports.delete = function(req, res) {
  let id = req.body.id;
  let item = req.body.deleteItem;
  let query = {"_id":id};
  let update = {$pull:{'items':item}};
  let title = req.body.title;
  List.findOneAndUpdate(query, update, {new: true}, function(err, remove) {
    if(err) {
      throw err;
    }
    else {
      res.redirect("/list/"+title+"/"+id)
    }
    next();
  });
}

exports.home = function(req, res) {
  List.find({}).sort({'popularity':-1}).limit(10).exec(function(err, data) {
    if(err) {
      throw err;
    }
    res.render('home',{
      id:data.id,
      title:data.title,
      data:data,
      popularity:data.popularity
    });
  });
}
