var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Parent = mongoose.model('Parent');
var Paper = mongoose.model('Paper');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/test', function(req, res, next){
  var user = new User({
    uid: 1,
    username: 'Sid',
    createTime: new Date()
  });
  user.save(function(err){
    if(err){
      res.end('Error');
      return next();
    }
    User.find({}, function(err, docs){
      if(err) {
        res.end('Error');
        return next();
      }

      res.json(docs);
    })
  })

  //User.findOne({username: 'Sid'}, function(err, doc) {
  //  if(err) {
  //    console.log('findOne err:', err);
  //    return;
  //  }
  //  if(doc) {
  //    doc.remove();
  //    User.find({}, function(err, docs){
  //      if(err) {
  //        res.end('Error');
  //        return next();
  //      }
  //
  //      res.json(docs);
  //    })
  //  }
  //})
})

router.get('/test1', function(req, res, next) {
  var paper = new Paper({
    //name: 'bite',
    //desc: 'hoho',
    ////createTime: { type: Date, get: dateFilter },
    ////lastEdit: { type: Date, default: Date.now },//当你插入文档，自动就会生成日期
    //topicNO: 1,
    //authorid: 2,
    //topics: [{
    //  name: 'topic',
    //  desc: 'desc',
    //  score: 5,
    //  imgs:[],
    //  answers: ['A','B'],
    //  options: [{
    //    name: 'naming',
    //    content: 'contentss',
    //    desc: 'ddesc'
    //  }]
    //}]
  });


  paper.save(function (err) {
    if (err) {
      res.end('Error');
      return next();
    }
    Paper.find({}, function (err, docs) {
      if (err) {
        res.end('Error');
        return next();
      }

      res.json(docs);
    })
  })
})

router.get('/test2', function(req, res, next) {

  Paper.findOne({}, function(err, doc) {
    if(err) {
      console.log('findOne err:', err);
      return;
    }
    if(doc) {
      doc.remove();
      Paper.find({}, function (err, docs) {
        if (err) {
          res.end('Error');
          return next();
        }

        res.json(docs);
      })
    }
  })
})




module.exports = router;
