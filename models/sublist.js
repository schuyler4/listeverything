const mongoose = require('mongoose');

const subListSchema = mongoose.Schema({
  rootItem: mongoose.Schema.Types.ObjectId,
  items: [String]
})

exports.subList = mongoose.model('subList', subListSchema);
