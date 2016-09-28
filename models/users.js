const mongoose = require('mongoose');
'use strict'
const bCrypt = require('bcrypt-nodejs');
const flash = require('connect-flash')

const saltRounds = 10;


const userSchma = mongoose.Schema({
  username: {type: String},
  password: {type: String}
});

const User = mongoose.model('User', userSchma);

exports.getSignup = function(req, res) {
  res.render('signup', {message: req.flash('signupErr')})
}

exports.postSignup = function(req, res) {
  User.findOne({username: req.body.username}, function(err, username) {
    if(err) {
      console.error(err);
    }
    console.log(username)
    if(req.body.password == req.body.retypePassword && username == null) {
      const password = req.body.password;
      var new_user = User({
        username: req.body.username,
        password: password
      })
      req.session.loggedin = true;
      res.redirect('/');
    }
    else if(username == null) {
      req.flash("signupErr","that username has alredy been taken")
      res.redirect('/signup')
    }
    else if(req.body.password != req.body.retypePassword) {
      req.flash("signupErr", "your passwords do not match")
      res.redirect('/signup')
    }
  });
}

exports.getLogin = function(req, res) {
  res.render('login', {message: req.flash('loginErr')})
}

exports.postLogin = function(req, res) {
    username = req.body.username
    password = req.body.password
    User.find({username: username, password:password}, function(err, user) {
      if(err) {
        console.err(err)
      }
      if(user) {
        req.session.loggedin = true
        res.redirect('/')
      }
      else {
        req.flash('loginErr','your username or password is incorect')
        res.redirect('/login')
      }
    });
}

exports.logout = function(req, res) {
  if(req.session.loggedin) {
    req.session.loggedin = false
  }
  res.redirect('/')
}

exports.isLoggedIn = function(req, res) {
  if(req.session.loggedin) {
    console.log(req.session.loggedin)
    return true
  }
  else {
    return false
  }
}
