'use strict'
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passwordHash = require('password-hash-and-salt')


const userSchma = mongoose.Schema({
  username: {type: String},
  password: {type: String}
});

const User = mongoose.model('User', userSchma);

exports.getSignup = function(req, res) {
  res.render('signup', {message: req.flash('signupErr')});
}

exports.postSignup = function(req, res) {
  User.findOne({username: req.body.username}, function(err, username) {
    if(err) {
      console.error(err);
    }
    if(req.body.password == req.body.retypePassword && username == null) {
      let password = req.body.password;

      if(err) {
        console.error(err);
      } else {
        if(err) {
          console.err(err)
        } else {
          passwordHash(password).hash(function(err, hash) {
              if(err) {
                console.error(err);
              } else {
                let newUser = new User({
                  username: req.body.username,
                  password: hash
                });
                newUser.save(function(err, save) {
                  if(err) {
                    console.error(err);
                  }
                });
                console.log("panda");
              }
          });
        }
      }
      req.session.loggedin = true;
      res.redirect('/');
    }
    else if(username != null) {
      req.flash("signupErr","that username has alredy been taken")
      res.redirect('/signup')
    }
    else if(req.body.password != req.body.retypePassword) {
      req.flash("signupErr", "your passwords do not match")
      res.redirect('/signup')
    }
  });
}

exports.getLogin = function(req, res, next) {
  res.render('login', {message: req.flash('loginErr')})
}

exports.postLogin = function(req, res) {
  let username = req.body.username
  let password = req.body.password
  User.findOne({username: username}, function(err, user) {
    if(err) {
      console.err(err)
    }
    if(user) {
      passwordHash(password).verifyAgainst(user.password, function(err, verified) {
        if(err) {
          console.error(err)
        }
        if(!verified) {
          req.flash('loginErr', 'your username or password is incorect');
          res.redirect('/login')
        } else {
          req.session.loggedin = true
          res.redirect('/')
        }
      });
    } else {
      console.log("monkey")
      req.flash('loginErr', 'your username or password is incorect');
      res.redirect('/login');
    }
  });
}

exports.logout = function(req, res) {
  if(req.session.loggedin) {
    req.session.loggedin = false
    console.log(req.session.loggedin)
  }
  res.redirect('/')
}

exports.isLoggedIn = function(req, res, next) {
  if(req.session.loggedin) {
    next()
  }
  else {
    res.redirect('/login')
  }
}
