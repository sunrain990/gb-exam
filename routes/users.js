var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = mongoose.model('User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/c',function(req, res ,next){
  var user = req.body.user;

  var jstring = JSON.stringify(user);

  var user0 = new User({
    email: '',
    password: '',
    nickname: user.name,
    truename: user.name,
    gender: user.gender,
    city: '',
    mobile: '',
    qq: '',
    weixin: '',
    signature: jstring,
    company: user.company,
    locked: 0,
    //loginTime: '',
    loginIp: '0.0.0.0',
    lastLogin: 'logined'
  });

  delete user0['_id'];
  delete user0['id'];

  User.findOneAndUpdate({nickname: user.name},user0,{upsert:true},function(err,re) {
    console.log(err,re);
    res.json({code:1});
  });

});




module.exports = router;
