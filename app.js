const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const express = require('express');
const app = express();

app.disable('x-powered-by');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

const secret = require('./secret.js');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGOLAB_URI, function(err) {
  if(err) {
    console.error(err);
    console.log("panda");
  }
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('500');
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(cookieParser(secret.cookieSecret));

app.use(session({
  secret: secret.cookieSecret,
  cookie: {maxAge: 60 * 60 * 1000},
  resave: true,
  saveUninitialized: true,
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

require('./routes/main')(app);

app.listen(3000, function() {
  console.log("listening on 3000")
});
