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

    console.log(pmp_id,'this is pmp_id');

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

            Paper2exam.findById(pmp_id, function(err, p2e) {
               if(!err) {
                   if(p2e.status == 0) {
                       Paper2exam
                           .findOne(
                           query,
                           {
                               "mark": 0,
                               "topics.trueanswers": 0
                           })
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
                           .exec(function (err, p2e) {
                               if (!err) {
                                   console.log(p2e)
                                   return res.json({
                                       code: 1,
                                       text: '返回新试卷成功',
                                       data: p2e
                                   })
                               } else {
                                   console.log(err);
                                   return res.json({code: -1, text: err});
                               }
                           });
                   }else if(p2e.status == 1) {
                       return res.json({
                           code: 1,
                           text: '返回历史试卷成功',
                           data: p2e
                       })
                   }
               }else {

               }
            });


            //Paper2exam
            //    .findOne(
            //    query,
            //    {
            //        "mark": 0
            //        //,
            //        //"topics.trueanswers": 0
            //    })
            //    //.populate({
            //    //    path: 'generated_papers',
            //    //    populate: {
            //    //        path: 'paper',
            //    //        model: 'Paper'
            //    //    },
            //    //    options: {
            //    //        //limit: limit,
            //    //        //sort: {
            //    //        //    time: -1
            //    //        //},
            //    //        //skip: (page-1)*limit
            //    //    }
            //    //})
            //    .exec(function (err, p2e) {
            //        if (!err) {
            //            console.log(p2e)
            //            res.json({
            //                code: 1,
            //                text: '返回查询成功',
            //                data: p2e
            //            })
            //        } else {
            //            console.log(err);
            //            res.json({code: -1, text: err});
            //        }
            //    });
        }
    }
});

//分析数据
router.post('/u_mark', function(req, res, next){
    var p2e = req.body.p2e;
    var user_id = req.body.user_id;
    console.log(p2e);

    var pmp_id = p2e._id;
    if(!pmp_id) {
        return res.json({
            code: -1,
            text: '未有p2e的id'
        });
    }
    if(!user_id) {
        return res.json({
            code: -1,
            text: '未有userid'
        })
    }

    Paper2exam.findById(pmp_id, function(err, p2exam) {
        if(!err) {
            if(p2exam.status == 0) {

                console.log(p2exam,'this is p2exam');
                p2exam.topics = p2e.topics;
                for(var i=0;i<p2e.topics.length;i++) {
                    if(p2exam.topics[i].answers.sort().toString() == p2exam.topics[i].trueanswers.sort().toString()){
                        p2exam.topics[i].correct = 1;
                    }
                }
                p2exam.status = 1;
                p2exam.save(function(err, p2exam1) {
                    if(!err){
                        console.log(p2exam1,'this is p2exam1')
                        res.json({code:1,text:'返回成功！',data: p2exam1})
                    }else{
                        res.json({code: -1, text: '提交失败', data: err});
                    }
                });
            }else if(p2exam.status == 1){
                return res.json({code: -1, text: '已提交过',data:p2exam});
            }
        }else {
            res.json({code: -1, text:'提交失败', data:err})
        }
    });


    //var options = {
    //    new: true
    //};
    //delete p2e._id;
    //console.log(p2e._id,'----------idididiididi')
    //Paper2exam.findByIdAndUpdate(pmp_id, p2e, options, function(err, doc) {
    //    if(!err) {
    //        console.log(doc);
    //        res.json({code:1, text: '保存成功！', data: doc});
    //    } else {
    //        console.log(err);
    //        res.json({code: -1, text: '查找更新', data: err});
    //    }
    //});
})

router.post('/u_mark1', function(req, res, next) {
    var p2e = req.body.p2e;
    var user_id = req.body.user_id;
    console.log(p2e);

    var pmp_id = p2e._id;
    if(!pmp_id) {
        return res.json({
            code: -1,
            text: '未有p2e的id'
        });
    }
    if(!user_id) {
        return res.json({
            code: -1,
            text: '未有userid'
        })
    }

    Paper2exam.findById(pmp_id, function(err, p2exam) {
        var topic_ids = p2exam.topics.map(function(pm) {
            return pm._id;
        });

        console.log(topic_ids, 'this is topic ids!')

        var query = {
            $and: [
                {
                    'userid': user_id
                },
                {
                    topics: {
                        $elemMatch: {
                            _id: {$in: topic_ids}
                        }
                    }
                }
            ]
        };
        Paper2exam
            .aggregate(
            [
            //    {
            //    "$match": {
            //        "userid": user_id
            //        //$and: [
            //        //    {
            //        //        'userid': user_id
            //        //    }
            //        //    ,
            //        //    {
            //        //        topics: {
            //        //            $elemMatch: {
            //        //                _id: {$in: topic_ids}
            //        //            }
            //        //        }
            //        //    }
            //        //]
            //    }
            //},
            //    {
            //        "$group": {
            //            _id: {
            //                name: '$name',
            //                authorid: '$authorid'
            //            },
            //            count: {
            //                $sum: 1
            //            }
            //            //"userid": "userid"
            //        }
            //    },
                { $sample: { size: 3 } }
                //    ,
            //    {
            //        $project: {
            //            name: 1
            //        }
            //    }
            //    ,
            //{
            //    $group: {
            //        _id:  '$district'
            //    }
            //}
            ], function(err, p2exam) {
                if(!err){
                    res.json({code:1,text:'success',data:p2exam})
                }else {
                    res.json({code:-1,text:'错误',data:err})
                }
            });
    });


})






module.exports = router;