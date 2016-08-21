const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

const secret = require('./secret.js');
mongoose.Promise = global.Promise;
mongoose.connect(secret.url, function(err) {
  if(err) {
    console.log(err)
  }
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

require('./routes/main')(app);

app.listen(3000, function() {
  console.log("listening on 3000")
});
