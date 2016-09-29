const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');

module.exports = function(app) {
  const list = require('../models/list')
  const user = require('../models/users')

  app.get('/500', function(req, res) {
    res.render('500')
  });

  app.get('/', list.home)

  app.get('/addList', list.getAddList);
  app.post('/addList', list.postAddList);

  app.get('/listOflists', list.listOflists);
  app.post('/listOflists', list.listOflists);

  app.get('/list/:title/:id', list.getList);
  app.post('/like', list.like);
  app.post('/dislike', list.dislike);
  app.post('/comment', list.comment);
  app.post('/addItems', list.update);

  app.get('/deleteItems/:title/:id', user.isLoggedIn ,list.getDelete);
  app.post('/delete', list.postDelete);

  app.get('/signup',  user.getSignup);
  app.post('/signup', user.postSignup);

  app.get('/login', user.getLogin);
  app.post('/login', user.postLogin);
  app.get('/logout', user.logout);

  app.get('*', function(req, res){
    res.render('404');
  });
}
