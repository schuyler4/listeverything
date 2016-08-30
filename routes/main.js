const express = require('express');

module.exports = function(app) {
  const list = require('../models/list')
  const comment = require('../models/comments')

  app.get('/', list.home)

  app.get('/titleWarning', list.warning);

  app.get('/addList', list.addPage);
  app.post('/addList', list.create);

  app.get('/listOflists', list.listOflists);

  app.get('/list/:title/:id', list.get);
  app.post('/like', list.like);
  app.post('/dislike', list.dislike);
  app.post('/comment', list.comment);
  app.post('/addItems', list.update);
  app.post('/deleteItem', list.delete);
}
