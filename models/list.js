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
    date: Date,
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

exports.listOflists = function(req, res) {

  buildResultSet = function(docs) {
    var result = [];
    for(var object in docs){
      result.push(docs[object]);
    }
    return result;
  }

  var regex = new RegExp(req.query["term"], 'i');
  var query = List.find({fullname: regex}, { 'fullname': 1 })
    .sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);

  query.exec(function(err, listes) {
     if (!err) {
        let result = buildResultSet(listes);
        List.find({},function(err, data) {
          res.render('listOflists', {data:data,title:data.title,
            result:result});
        });
        console.log(result);
     } else {
        res.send(JSON.stringify(err), {
           'Content-Type': 'application/json'
        }, 404);
     }
  });
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
        comments: list.comments,
        id:list.id
      });
    }
  });

  List.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, post) {
    console.log( post );
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
  let query = {"_id":id};
  let update = {$set:{items:req.body.newItems}};

  List.findOneAndUpdate(query, update, {new: true}, function(err, update) {
    if(err) {
      console.log("panda")
      return console.error(err);
    }
    else {
      console.log("id not working")
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
