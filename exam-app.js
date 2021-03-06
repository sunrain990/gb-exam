var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('./config/db/mongoose');
var db = mongoose();

var routes = require('./routes/index');
var users = require('./routes/users');
var exam = require('./routes/exam');
var exam_g = require('./routes/exam_g');
var paper2exam = require('./routes/paper2exam');
var mis = require('./routes/mistake');

var cors = require('cors');

var app = express();
var port = 11111;
console.log('listen on:' + port);
app.listen(port);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true, parameterLimit:50000 }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use('/', routes);
app.use('/users', users);
app.use('/exam', exam);
app.use('/exam_g', exam_g);
app.use('/p2e', paper2exam);
app.use('/mis', mis);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
