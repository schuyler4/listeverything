const mongoose = require('mongoose');
const async = require('async');
const ValidationError = mongoose.Error.ValidationError;
const ValidatorError  = mongoose.Error.ValidatorError;
const comments = require('../models/comments');
const text = require('../text')

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

function redirect(req, res) {
  res.redirect('/addList')
}

let title;
let id;
let session;

exports.addPage = function(req, res) {
  if(session) {
    res.render('addList',{title: session.title, about: session.about,
      items: session.items, warning: text.textWarning});
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
      res.redirect('500');
      console.error(err);
    }
    else if(title) {
      res.redirect('/addList')
    }
    else {
      userList.save(function(err, userList) {
        if (err) {
          res.redirect('500');
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

exports.listOflists = function(req, res) {

  List.find({}, function(err, all) {
    if(err) {
      console.err('err')
      res.redirect('/500')
    }
    else {
      res.render('listOflists',{
        data:all,
        title:all.title,
      })
    }
  });
}
let searchSession;

exports.search = function(req, res) {
  searchSession = req.session;
  searchSession.title = [];
  searchSession.itemId = [];

  let search = req.body.search;

  List.find({'title':search}, function(err, search) {
    if(err) {
      console.error(err);
    }
    else {
      for(let i = 0;i < search.length;i++) {
        console.log("panda")
        searchSession.title.push(search[i].title);
        //searchSession.itemId.push(search[i]._id);
        console.log(search[i].id);
      }
      res.redirect('/listSearch');
    }
  });
}

exports.searchFound = function(req, res) {
  res.render('search', {title:searchSession.title,id:searchSession.itemId});
}

exports.get = function(req, res) {
  title = req.params.title;
  id = req.params.id;

  List.findById(id, function(err, list) {
    if(err) {
      res.redirect('500');
      console.error(err);
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
          console.error(err);
        }
        else {
          console.log(listItems);
        }
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

exports.update = function(req, res) {

  let query = {"title":title};
  let update = {$push:{items:req.body.newItems}};

  List.findOneAndUpdate(query, update, {new: true}, function(err, update) {
    if(err) {
      return console.error(err);
    }
    else {
      console.log(id);
      console.log(title);
      res.redirect("/list/"+title+'/'+id);
    }
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
