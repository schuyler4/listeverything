const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const hash = require('password-hash');

const test = [
  {id:1, username: 'sfa', password: '123'},
  {id:2, username: 'fas', password: '321'}
];

const userSchma = mongoose.Schema({
  username: {type: String},
  password: {type: String, set: function(newValue) {
    return Hash.isHashed(newValue) ? newValue : Hash.generate(newValue);
  }}
});

userSchma.statics.authenticate = function(username, password, callback) {
  this.findOne({username:username}, function(err, user) {
    if(user &amp;&amp; Hash.verify(password, user.password)) {
      callback(null, user);
    }
    else if (user || !error){
      error = new Error("username or pass has already been used");
      callback(error, null);
    }
    else {
      callback(error, null);
    }
  });
}

const User = mongoose.model('User', userSchma);

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function(err, user) {
      done(error, user);
    });
});

passport.use('local', new LocalStrategy(
    process.nextTick(function() {

    });
);

exports.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated())
        return next();
  else {
    res.redirect('/login');
  }
}

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

exports.signup = function(req, res) {

}

exports.login = function(req, res) {
  res.redirect('/');
  console.log("logged in");
}

exports.logout = function(req, res) {
  req.logout();
  console.log("logged out");
}
