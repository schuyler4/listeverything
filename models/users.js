const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const hash = require('password-hash');
const bCrypt = require('bcrypt-nodejs');

const userSchma = mongoose.Schema({
  username: {type: String},
  password: {type: String}
});

const User = mongoose.model('User', userSchma);

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
});

passport.use('login', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {

    User.findOne({ 'username' :  username },
      function(err, user) {
        if (err)
          throw err;
          return done(err);
        if (!user){
          return done(null, false,
            req.flash('message', 'your username or password wrong'));
        }
        if (!isValidPassword(user, password)){
          return done(null, false,
            req.flash('message', 'your username or password wrong'));
        }
        return done(null, user);
      }
    );
}));

let isValidPassword = function(user, password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

passport.use('signup', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {
    findOrCreateUser = function(){
      User.findOne({'username':username},function(err, user) {
        if (err){
          throw err;
          return done(err);
        }
        if (user) {
          return done(null, false,
             req.flash('message','someone beat you to this username'));
        } else {
          var newUser = new User();
          newUser.username = username;
          newUser.password = createHash(password);

          newUser.save(function(err) {
            if (err){
              throw err;
            }
            return done(null, newUser);
          });
        }
      });
    };
    process.nextTick(findOrCreateUser);
}));

let createHash = function(password){
 return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

exports.login = function(req, res, next) {
  res.render('login',{message: req.flash('message')});
}


exports.isLoggedIn = function(req, res, next) {
  console.log("req is authenticated")
  if (req.isAuthenticated()) {
        console.log("in");
        return next();
  } else {
    res.redirect('/login');
  }
}

exports.signup = function(req, res) {
  res.render('signup',{message: req.flash('message')});
}

exports.logout = function(req, res) {
  req.logout();
}
