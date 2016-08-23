const express = require('express');

module.exports = function(app) {
  const list = require('../models/list')
  const comment = require('../models/comments')

  app.get('/', list.home)

  app.get('/addList', function(req, res) {
    res.render('addList')
  });

  app.post('/addList', function(req, res) {
    title = req.body.title
    about = req.body.about
    items = req.body.items

    list.create(title, about, items, function(err, list) {

    })
    res.redirect('/');
  });

  app.get('/listOflists', function(req, res) {
    list.all(function(err, data) {
      res.render('listOflists', {data:data,title:data.title})
    });
  });

  app.get('/list/:id', list.get);
  app.post('/like', list.like);
  app.post('/dislike', list.dislike);
  app.post('/comment', list.comment);

  app.get('/editList/:id', list.getEdit);
  app.post('/addItems', list.update);
  app.post('/deleteItem', list.delete);
}
