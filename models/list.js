const mongoose = require('mongoose');
const comments = require('../models/comments')

const listSchema = mongoose.Schema({
  title: String,
  about: String,
  items: [String],
  popularity: Number,
  comments:[String]
});

/*listSchema.methods.findIfCreated = function(title) {
  List.find({}, function(err, list) {
    list.forEach(function(list) {
      if(list.title == title) {
        return true;
        console.log("created")
      }
      else {
        console.log("not created")
        return false;
      }
    });
  });
}*/

listSchema.validate(function (value, res) {
    List.findOne({name: value}, 'id', function(err, user) {
        if (err) return res(err);
        if (user) return res(false);
        res(true);
    });
}, 'already exists');

const List = mongoose.model('List', listSchema);

/*function updateUser(user,cb){
    List.find({name : user.name}, function (err, docs) {
        if (docs.length){
            //cb('Name exists already',null);
            console.log("exists")
            return false;
        }else{
            return true;
            console.log("dosen't exist")
        }
    });
}*/

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

  userList.findIfCreated(userList.title)
  userList.save(function(err, userList) {
    if (err) return console.error(err);
    title = userList.title;
    id = userList.id;
    res.redirect('/list/' + title + '/' + id)
  })
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
      console.log(id)
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
