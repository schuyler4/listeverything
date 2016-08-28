const express = require('express');

module.exports = function(app) {
  const list = require('../models/list')
  const comment = require('../models/comments')

  app.get('/', list.home)

  app.get('/flash', function(req, res) {
    req.flash('info', 'Flash is back!')
    res.redirect('/');
  });

  app.get('/addList', function(req, res, next) {
    res.render('addList')
    next();
  },list.getAdd);
  app.post('/addList', list.create);

  app.get('/listOflists', function(req, res) {
    list.all(function(err, data) {
      res.render('listOflists', {data:data,title:data.title})
    });
  });

  app.get('/list/:title/:id', list.get);
  app.post('/like', list.like);
  app.post('/dislike', list.dislike);
  app.post('/comment', list.comment)

  app.get('/editList/:title/:id', list.getEdit);
  app.post('/addItems', list.update);
  app.post('/deleteItem', list.delete);
}
