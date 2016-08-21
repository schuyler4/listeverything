const mongoose = require('mongoose');

const listSchema = mongoose.Schema({
  title: String,
  Description: String,
  items: [String],
  popularity: Number
});

const List = mongoose.model('List', listSchema)

exports.create = function(title, description, items) {
  let userList = new List({
    title: title,
    description: description,
    items: items,
    popularity: 1
  })

  userList.save(function(err, userList) {
    if (err) return console.error(err);
  })
}

exports.all = function(data) {
  List.find({}, data)
}

exports.get = function(data, cb) {
  List.findById(id, function(err, data) {
    if (err) return console.error(err);
  });
}
