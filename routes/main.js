const express = require('express');

module.exports = function(app) {
  const list = require('../models/list')

  app.get('/', function(req, res) {
    res.render('home');
  });

  app.get('/addList', function(req, res) {
    res.render('addList')
  });

  app.post('/addList', function(req, res) {
    title = req.body.title
    description = req.body.description
    items = req.body.items

    list.create(title, description, items, function(err, list) {

    })
    res.redirect('/');
  });

  app.get('/listOflists', function(req, res) {
    list.all(function(err, data) {
      res.render('listOflists', {data:data,title:data.title})
    });
  });

  app.get('/list/:id', function(req, res) {
    list.get(req.params.id, function(err, data) {
      res.render('list', {
        title:data.title,
        description:data.description,
        items:data.items
      });
    });
  });
}
