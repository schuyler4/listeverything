const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');

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

  app.get('/deleteItems/:title/:id', user.isLoggedIn, list.getDelete);
  app.post('/delete', list.delete);

  app.get('/login', user.login);
  app.post('/login', passport.authenticate('login', {
    successRedirect:'/',
    failureRedirect:'/login',
    failureFlash: true
  }));
  app.get('/logout', function(req, res) {
    if(user.isLoggedIn) {
      req.logout();
    }
    res.redirect('/');
  })
  app.get('/signUp', user.signup);
  app.post('/signup', passport.authenticate('signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true,
  }));

  app.get('*', function(req, res){
    res.render('404');
  });
}
