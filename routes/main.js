const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function(app) {
  const list = require('../models/list')
  const comment = require('../models/comments')
  const user = require('../models/users')

  app.get('/500', function(req, res) {
    res.render('500')
  });

  app.get('/', list.home)

  app.get('/addList', list.addPage);
  app.post('/addList', list.create);

  app.get('/listOflists', list.listOflists);
  app.post('/listOflists', list.listOflists);

  app.get('/list/:title/:id', list.get);
  app.post('/like', list.like);
  app.post('/dislike', list.dislike);
  app.post('/comment', list.comment);
  app.post('/addItems', list.update);
  //app.post('/deleteItem', list.delete);
  app.get('/deleteItems', user.isLoggedIn, function(req, res) {
    console.log("u are logged in");
    res.send('delete items page');
  });

  app.get('/login', function(req, res) {
    res.render('login');
  });
  app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' })
  ,user.login);
  app.get('/loginFailure', function(req, res, next) {
    res.send('failed');
  });
  app.get('/loginSuccess', function(req, res, next) {
    res.send('passed');
  });
  app.get('/signUp', function(req, res) {
    res.render('signup');
  });
  app.post('/signup', user.signup);

  app.get('*', function(req, res){
    res.render('404');
  });
}
