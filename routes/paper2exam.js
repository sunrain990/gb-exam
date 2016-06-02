/**
 * Created by kevin on 16/6/2.
 */
var express = require('express');
var router = express.Router();
var _ = require('lodash');

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Paper = mongoose.model('Paper');
var Topic = mongoose.model('Topic');
var Paper2exam = mongoose.model('Paper2exam');


router.post('/c', function (req, res, next) {
    var p2e = req.body.p2e;

    var pmp_id = p2e.pmp_id;
    if(!pmp_id) {
        return res.json({
            code: -1,
            text: '未有pmp的id'
        });
    }

    if (pmp_id == 0) {
        return res.json({code: -1, text: 'pmp传参错误！'});
        //var p2e0 = new Paper2exam({
        //    name: exam_g.name,
        //    desc: exam_g.desc,
        //    paper_ids: [],
        //    class_ids: [],
        //    author_id: exam_g.author_id,
        //    topic_count: exam_g.topic_count,
        //    generator: exam_g.generator,
        //    generated_papers: []
        //});
        //
        //exam_g0.save(function (err, doc) {
        //    if (!err) {
        //        console.log(doc);
        //        res.json({code: 1, text: '新建generator成功！', data: doc});
        //    } else {
        //
        //    }
        //});
    } else {
        if (!pmp_id) {
            return res.json({code: -1, text: 'pmp传参错误！'});
        } else {
            var query = {
                _id: pmp_id
            };
            console.log(query, 'this is query');

            Paper2exam
                .findOne(query)
                //.populate({
                //    path: 'generated_papers',
                //    populate: {
                //        path: 'paper',
                //        model: 'Paper'
                //    },
                //    options: {
                //        //limit: limit,
                //        //sort: {
                //        //    time: -1
                //        //},
                //        //skip: (page-1)*limit
                //    }
                //})
                .exec(function (err, paper) {
                    if (!err) {
                        console.log(paper)
                        res.json({
                            code: 1,
                            text: '返回查询成功',
                            data: paper,
                        })
                    } else {
                        console.log(err);
                        res.json({code: -1, text: err});
                    }
                });
        }
    }
});

router.post('/u', function(req, res, next){
    var p2e = req.body.p2e;
    console.log(p2e);
    res.json({code: -1,text:'',data:p2e})

})






module.exports = router;