const mongoose = require('mongoose');
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
      bcrypt.hash(password, saltRounds, function(err, hash) {
        let new_user = User({
          username: req.body.username,
          password: password
        })
      });
      req.session.loggedin = true
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
