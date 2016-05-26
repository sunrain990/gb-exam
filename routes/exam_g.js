/**
 * Created by kevin on 16/5/26.
 */
var express = require('express');
var router = express.Router();
var _ = require('lodash');

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Paper = mongoose.model('Paper');
var Topic = mongoose.model('Topic');
var Exam_g = mongoose.model('Exam_g');

router.get('/', function(req, res, next) {
    res.json({text: 'welcome to the exam_g router'})
});


router.post('/c', function(req, res, next) {
    var exam_g = req.body.exam_g;
    if(!exam_g){
        return res.json({code:-1,text:'参数错误！'});
    }
    var exam_g0 = new Exam_g(exam_g);
    exam_g0.save(function(err, doc) {
        if (!err) {
            console.log(doc);
            res.json({code:1,text:'新建成功',data:doc});
            //return next();
        } else{
            res.json({code:-1,text:err});
        }
    })
});

module.exports = router;