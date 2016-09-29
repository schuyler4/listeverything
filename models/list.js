'use strict'
const mongoose = require('mongoose');
const async = require('async');
const ValidationError = mongoose.Error.ValidationError;
const ValidatorError  = mongoose.Error.ValidatorError;
const text = require('../text')
const flash = require('connect-flash');

const subList = require('../models/users');

const itemSchema = mongoose.Schema({
  content: String,
  subList: mongoose.Schema.Types.ObjectId,
  list: mongoose.Schema.Types.ObjectId
});

const listSchema = mongoose.Schema({
  title: {
    type: String,
  },
  about: String,
  items: [mongoose.Schema.Types.ObjectId],
  popularity: Number,
  comments:[String]
});

const Item = mongoose.model('Item', itemSchema);
const List = mongoose.model('List', listSchema);

let used = false;
let session;

exports.getAddList = function(req, res) {
    res.render('addList', {message: req.flash('listCreationError')});
}

exports.postAddList = function(req, res) {
  let userList = new List({
    title: req.body.title,
    about: req.body.about,
    popularity: 1,
    comments:[]
  });

  let data;
  let i;
  let newObjectArray = []
  for(i=0; i < object.item.length, i++) {
    newObjectArray.push({})
  }

  let userListItem = new Item({
    content: req.body.items,
    list: userList.id
  });

  let listTitle = userList.title;
  let listItems = userListItem.content;

  List.findOne({title: userList.title}, 'title', function(err, title) {
    if(err) {
      console.error(err);
    }
    else if(title) {
      req.flash('listCreationError',
      'the title for this list already exists here');
      res.redirect('/addList');
    }
    else if(!listTitle || !listItems) {
      req.flash('listCreationError',
      'you dident include a title or items in your list');
      res.redirect('/addList');
    }
    else {
      userList.save(function(err, userList) {
        if (err) {
          console.error(err);
        } else {
          res.redirect('/list/' + userList.title + '/' + userList.id);
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
      console.error(err);
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

exports.getList = function(req, res) {
  let urlTitle = req.params.title;
  let id = req.params.id;

  List.findById(id, function(err, list) {
    if(err) {
      console.error(err);
    }
    else {
      if(list) {
        res.render('list', {
          title: list.title,
          about: list.about,
          items: list.items,
          popularity: list.popularity,
          comments: list.comments,
          id:list.id
        });
        const listItems = list.items;
      }
      else {
        res.redirect('/');
      }
    }
  });
  List.findById(id).select('comments').sort({date:1}).exec(function(err, comments) {
    if(err) {
      console.error(err);
    }
  });
}

exports.like = function(req, res) {
  if(!req.session.liked) {
    let id = req.body.id;
    let query = {"_id":id};
    let update ={$inc:{popularity:1}};

    List.findOneAndUpdate(query, update, {new: true}, function(err, update) {
      if(err) {
        console.error(err);
      }
      req.session.liked = true
      res.redirect('/list/'+ update.title + '/'+ id);
    });
  }
}

exports.dislike = function(req, res) {
  let id = req.body.id;

  let query = {"_id":id};
  let update ={$inc:{popularity:-1}};

  List.findOneAndUpdate(query, update, {new: true}, function(err, update) {
    if(err) {
      console.error(err);
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
      console.error(err);
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
    if(err)  {
      console.error(err);
    }
    res.redirect("/list/" + update.fsadfdsa + '/' +id);
  });
}

const user = require('../models/users')

exports.getDelete = function(req, res) {
  if(user.isLoggedIn) {
    let id = req.params.id;
    let title = req.params.title;

    List.findById(id, function(err, list) {
      if(err) {
        console.error(err);
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
            console.error(err);
          }
        });
      }
    });
  }
  else {
    res.redirect('/login')
  }
}

exports.postDelete = function(req, res) {
  if (user.isLoggedIn) {
    let id = req.body.id;
    let item = req.body.deleteItem;
    let query = {"_id":id};
    let update = {$pull:{'items':item}};
    let title = req.body.title;
    List.findOneAndUpdate(query, update, {new: true}, function(err, remove) {
      if(err) {
        console.error(err);
      }
      res.redirect("/list/"+title+"/"+id)
    });
  }
  else {
    res.redirect("/login")
  }
}

exports.home = function(req, res) {
  List.find({}).sort({'popularity':-1}).limit(10).exec(function(err, data) {
    if(err) {
      console.error(err);
    }
    res.render('home',{
      id:data.id,
      title:data.title,
      data:data,
      popularity:data.popularity
    });
  });
}
