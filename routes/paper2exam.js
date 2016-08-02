/**
 * Created by kevin on 16/6/2.
 */
var express = require('express');
var router = express.Router();
var _ = require('lodash');

var moment = require('moment');

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Paper = mongoose.model('Paper');
var Topic = mongoose.model('Topic');
var Paper2exam = mongoose.model('Paper2exam');
var Mistake = mongoose.model('Mistake');


router.post('/c', function (req, res, next) {
    var p2e = req.body.p2e;

    var pmp_id = p2e.pmp_id;
    if (!pmp_id) {
        return res.json({
            code: -1,
            text: '未有pmp的id'
        });
    }

    console.log(pmp_id, 'this is pmp_id');

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

            Paper2exam.findById(pmp_id, function (err, p2e) {
                if (!err) {
                    if(!p2e){
                        return res.json({code:-1,text:'no such pmp'});
                    }

                    if (p2e.status == 0) {
                        // Paper2exam
                        //     .findOne(
                        //     query,
                        //     {
                        //         "mark": 0,
                        //         "topics.trueanswers": 0
                        //     })
                        //     //.populate({
                        //     //    path: 'generated_papers',
                        //     //    populate: {
                        //     //        path: 'paper',
                        //     //        model: 'Paper'
                        //     //    },
                        //     //    options: {
                        //     //        //limit: limit,
                        //     //        //sort: {
                        //     //        //    time: -1
                        //     //        //},
                        //     //        //skip: (page-1)*limit
                        //     //    }
                        //     //})
                        //     .exec(function (err, p2e) {
                        //         if (!err) {
                        //             return res.json({
                        //                 code: 1,
                        //                 text: '返回新试卷成功',
                        //                 data: p2e,
                        //                 countdown: {
                        //                     now_time:new Date(),
                        //                     //end_time:moment(p2e.endTime).valueOf()
                        //                     end_time: p2e.endTime
                        //                 }
                        //             })
                        //         } else {
                        //             console.log(err);
                        //             return res.json({code: -1, text: err});
                        //         }
                        //     });


                        Mistake.aggregate(
                            [
                                {
                                    '$match': {
                                        $and: [
                                            {
                                                'userid': parseInt(p2e.userid)
                                            },
                                            {
                                                'generator': new mongoose.Types.ObjectId(p2e.generator)
                                            }
                                        ]
                                    }
                                },
                                {
                                    '$project': {
                                        topics: "$topics"
                                    }
                                }
                            ], function(err, mis) {
                                //keyed数组
                                if(!err) {
                                    var keyed = _.keyBy(mis[0].topics, '_id');


                                    var p2p2 = p2e.toObject();
                                    for(var i=0;i<p2p2.topics.length;i++) {
                                        p2p2.topics[i].favor = keyed[p2p2.topics[i]._id].favor;
                                    }
                                    return res.json({
                                        code: 1,
                                        text: '返回新试卷成功',
                                        data: p2p2,
                                        countdown: {
                                            now_time:new Date(),
                                            //end_time:moment(p2e.endTime).valueOf()
                                            end_time: p2e.endTime
                                        }
                                    });
                                } else{
                                    return res.json({code: -1, text: '返回出错', data: err})
                                }
                            }
                        );

                    } else if (p2e.status == 1) {

                        Mistake.aggregate(
                            [
                                {
                                    '$match': {
                                        $and: [
                                            {
                                                'userid': parseInt(p2e.userid)
                                            },
                                            {
                                                'generator': new mongoose.Types.ObjectId(p2e.generator)
                                            }
                                        ]
                                    }
                                },
                                {
                                    '$project': {
                                        topics: "$topics"
                                    }
                                }
                            ], function(err, mis) {
                                //keyed数组
                                var keyed = _.keyBy(mis[0].topics, '_id');


                                var p2p2 = p2e.toObject();
                                for(var i=0;i<p2p2.topics.length;i++) {
                                    p2p2.topics[i].favor = keyed[p2p2.topics[i]._id].favor;
                                }
                                return res.json({
                                    code: 1,
                                    text: '返回历史试卷成功',
                                    data: p2p2,
                                    countdown: {
                                        now_time: '00:00:00',
                                        end_time: '00:00:00'
                                    }
                                })
                            }
                    );


                        //Paper2exam.aggregate([
                        //    {
                        //        $match: {
                        //            //$and: [
                        //            //    {
                        //            //        'userid': parseInt(user_id)
                        //            //    },
                        //            //    {
                        //            //        'generator': new mongoose.Types.ObjectId(generator_id)
                        //            //    }
                        //            //]
                        //            //$eq:{
                        //                _id:  new mongoose.Types.ObjectId(pmp_id)
                        //            //}
                        //            //$and: [
                        //            //    {
                        //            //        '_id': pmp_id
                        //            //    }
                        //            //]
                        //        }
                        //    }
                        //    ,
                        //    {
                        //        $unwind: "$topics"
                        //    },
                        //
                        //    {
                        //        $lookup: {
                        //            from: "mistakes",
                        //            localField: "topics",
                        //            foreignField: ""
                        //        }
                        //    }
                        //], function(err ,p2e0) {
                        //    return res.json({
                        //        code: 1,
                        //        text: '返回历史试卷成功',
                        //        data: p2e0,
                        //        //now_time: nd
                        //        countdown: {
                        //            now_time: '00:00:00',
                        //            end_time: '00:00:00'
                        //        }
                        //    })
                        //});
                    }
                } else {
                    return res.json({code:-1,text:'err',data:err})
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
router.post('/u_mark', function (req, res, next) {
    var p2e = req.body.p2e;
    var user_id = req.body.user_id;
    console.log(p2e);

    var pmp_id = p2e._id;
    if (!pmp_id) {
        return res.json({
            code: -1,
            text: '未有p2e的id'
        });
    }
    if (!user_id) {
        return res.json({
            code: -1,
            text: '未有userid'
        })
    }
    Paper2exam.findById(pmp_id, function (err, p2exam) {
        if (!err) {
            if(!p2exam) {
                return res.json({code:-1, text:'cannot mark for none exiting p2e'});
            }
            console.log(p2exam._id, 'this is p2exam',pmp_id);
            if (p2exam.status == 0) {
                p2exam.topics = p2e.topics;
                var tmp_correct = 0;
                if(!p2exam.topics) {
                    return res.json({code:-1,text:'未有topics题目!'})
                }
                for (var i = 0; i < p2exam.topics.length; i++) {
                    if (p2exam.topics[i].answers.sort().toString() == p2exam.topics[i].trueanswers.sort().toString()) {
                        p2exam.topics[i].correct = 1;
                        console.log('this correct!!!- - - - -')
                        tmp_correct++;
                    }
                }
                //状态改为已做
                p2exam.status = 1;
                //完成时间为当前时间
                p2exam.finishTime = new Date();
                p2exam.topicNO = p2exam.topics.length;
                p2exam.correctNO = tmp_correct;
                p2exam.wasteTime = moment.utc(moment(p2exam.finishTime).diff(moment(p2exam.createTime))).format('HH:mm:ss');


                p2exam.save(function (err, p2exam0) {
                    if (!err) {

                        //获取所有该卷题目的_id
                        var topic_ids = p2exam0.topics.map(function (pm) {
                            return pm._id;
                        });

                        //聚合数据，返回 _id:{_id,correct,total}
                        Paper2exam
                            .aggregate(
                            [
                                {
                                    "$match": {

                                        $and: [
                                            {
                                                "userid": parseInt(user_id)
                                            }
                                            ,
                                            {
                                                "topics": {
                                                    $elemMatch: {
                                                        _id: {
                                                            $in: topic_ids.map(function (tid) {
                                                                return new mongoose.Types.ObjectId(tid);
                                                            })
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                                ,
                                {
                                    $unwind: "$topics"
                                },
                                {
                                    $match: {
                                        'topics._id': {
                                            $in: topic_ids.map(function (tid) {
                                                return new mongoose.Types.ObjectId(tid);
                                            })
                                        }
                                    }
                                }
                                ,
                                {
                                    $project: {
                                        _id: '$topics._id',
                                        name: '$topics.name',
                                        correct: '$topics.correct'
                                    }
                                }
                                ,
                                {
                                    $group: {
                                        _id: '$_id',
                                        total: {
                                            $sum: 1
                                        }
                                        ,
                                        correct: {
                                            $sum: {
                                                $cond: [
                                                    {
                                                        $and:[
                                                            {
                                                                $eq: ['$correct', 1]
                                                            }
                                                        ]
                                                    }
                                                    ,1,0
                                                ]
                                            }
                                        }
                                    }
                                }
                            ], function (err, p2exam1) {
                                if (!err) {

                                    console.log(p2exam1, 'this is p2exam1');

                                    //keyed数组
                                    var keyed = _.keyBy(p2exam1, '_id');

                                    for (var i = 0; i < p2exam0.topics.length; i++) {
                                        console.log('dodododoodo correct - -- - -- ', keyed[p2exam0.topics[i]._id].correct);
                                        p2exam0.topics[i].correctNO = keyed[p2exam0.topics[i]._id].correct;
                                        p2exam0.topics[i].total = keyed[p2exam0.topics[i]._id].total;
                                        p2exam0.topics[i].mistakes.push(p2exam0.topics[i].answers);
                                    }

                                    //保存完成后试卷
                                    p2exam0.save(function(err, p2examsaved) {
                                        if (!err) {
                                            console.log(p2exam0, 'sdfsdfsfsfsfs', p2examsaved)
                                            //return res.json({code:1,text:'tttt',data:p2exam});
                                            console.log(p2exam0.generator, ' this is generator!-- - -');

                                            var mis_id = p2exam0.generator;

                                            var query = {
                                                generator: mis_id,
                                                userid: user_id
                                            }

                                            Mistake.findOne(query, function (err, mis) {
                                                if(!err) {
                                                    console.log(mis, pmp_id, 'this is mis!-- -- - - - -- - --');
                                                    //mis = mis[0];
                                                    if(!mis) {

                                                        console.log('in mis!-- -- - - - -- - --');
                                                        console.log(p2exam0, '<>--ds-f-sdd- f-s --sd -s- -<><><><><><><><><><><>11111');
                                                        var mistake = new Mistake({
                                                            //_id: mis_id,
                                                            name: p2e.name,
                                                            desc: p2e.desc,
                                                            //0.根据生成器生成的题库 1.题库 2.错题库
                                                            //type: { type: Number, default: 2 },
                                                            //createTime: { type: Date, default: Date.now  },
                                                            lastEdit: { type: Date, default: Date.now },//当你插入文档，自动就会生成日期
                                                            //topicNO: { type: Number, default: 0},
                                                            authorid: p2e.authorid,
                                                            userid: p2e.userid,
                                                            classid: p2e.classid,
                                                            generator: p2e.generator,
                                                            topics: p2exam0.topics,
                                                            imgs: []
                                                        });

                                                        for (var i = 0; i < mistake.topics.length; i++) {
                                                            mistake.topics[i].correctNO = keyed[mistake.topics[i]._id].correct;
                                                            mistake.topics[i].total = keyed[mistake.topics[i]._id].total;
                                                            mistake.topics[i].mistakes.push(mistake.topics[i].answers);
                                                            // 确保是未编辑状态
                                                            mistake.topics[i].status = 1;
                                                            if(mistake.topics[i].correct) {
                                                                mistake.topics[i].last = true;
                                                            }else {
                                                                mistake.topics[i].last = false;
                                                            }
                                                        }

                                                        mistake.save(function(err, mis) {
                                                            if(!err){
                                                                return res.json({code:1,text:'mistake new success',data:p2exam0})
                                                            }else{
                                                                return res.json({code:-1,text:'mistake save err'})
                                                            }
                                                        });
                                                    }else {
                                                        console.log(mis, 'this is nononono miskekekekekek');

                                                        for(var i=0;i<p2exam0.topics.length;i++) {
                                                            var tmp_id = p2exam0.topics[i]._id;
                                                            if(_.some(mis.topics,['_id',tmp_id])) {
                                                                console.log('exsits -id')

                                                                mis.topics.id(tmp_id).total = keyed[tmp_id].total;
                                                                mis.topics.id(tmp_id).correctNO = keyed[tmp_id].correct;
                                                                mis.topics.id(tmp_id).mistakes.push(p2exam0.topics[i].answers);

                                                                if(p2exam0.topics[i].correct) {
                                                                    mis.topics.id(tmp_id).last = true;
                                                                }else {
                                                                    mis.topics.id(tmp_id).last = false;
                                                                }
                                                            }else{
                                                                console.log('no exsits -id')
                                                                var topic = p2exam0.topics[i];
                                                                topic.total = keyed[tmp_id].total;
                                                                topic.correctNO = keyed[tmp_id].correct;
                                                                topic.mistakes.push(p2exam0.topics[i].answers);
                                                                mis.topics.push(topic);

                                                                if(p2exam0.topics[i].correct) {
                                                                    mis.topics.id(tmp_id).last = true;
                                                                }else {
                                                                    mis.topics.id(tmp_id).last = false;
                                                                }
                                                            }
                                                        }
                                                        mis.lastEdit = new Date();
                                                        mis.papernums += 1;
                                                        console.log(p2exam0, 'before save');
                                                        mis.save(function(err, mistake) {
                                                            if(!err){
                                                                console.log(p2exam0, 'after save');

                                                                Mistake.aggregate(
                                                                    [
                                                                        {
                                                                            '$match': {
                                                                                $and: [
                                                                                    {
                                                                                        'userid': parseInt(p2exam0.userid)
                                                                                    },
                                                                                    {
                                                                                        'generator': new mongoose.Types.ObjectId(p2exam0.generator)
                                                                                    }
                                                                                ]
                                                                            }
                                                                        },
                                                                        {
                                                                            '$project': {
                                                                                topics: "$topics"
                                                                            }
                                                                        }
                                                                    ], function(err, mis) {
                                                                        //keyed数组
                                                                        if(!err) {
                                                                            var keyed = _.keyBy(mis[0].topics, '_id');


                                                                            var p2p2 = p2exam0.toObject();
                                                                            for(var i=0;i<p2p2.topics.length;i++) {
                                                                                p2p2.topics[i].favor = keyed[p2p2.topics[i]._id].favor;
                                                                            }
                                                                            return res.json({
                                                                                code: 1,
                                                                                text: '返回新试卷成功',
                                                                                data: p2p2,
                                                                            });
                                                                        } else{
                                                                            return res.json({code: -1, text: '返回出错', data: err})
                                                                        }
                                                                    }
                                                                )
                                                                // res.json({code:1,text:'mistake update success',data:p2exam0})
                                                            }else{
                                                                res.json({code:-1,text:'更新mistake fail'});
                                                            }
                                                        })
                                                    }
                                                }else {
                                                    res.json({code:-1,text:'mistake fool'})
                                                }
                                            });

                                        } else {
                                            res.json({code: -1, text: 'p2esaved失败', data: err});
                                        }
                                    });

                                    //res.json({code: 1, text: 'success', data: keyed})
                                } else {
                                    res.json({code: -1, text: '错误', data: err})
                                }
                            });

                    } else {
                        res.json({code: -1, text: '提交失败', data: err});
                    }
                });

                //p2exam.save(function (err, p2exam1) {
                //    if (!err) {
                //
                //    } else {
                //        res.json({code: -1, text: '提交失败', data: err});
                //    }
                //});
            } else if (p2exam.status == 1) {
                return res.json({code: -1, text: '已提交过', data: p2exam});
            }
        } else {
            res.json({code: -1, text: '提交失败', data: err})
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

router.post('/u_mark1', function (req, res, next) {
    var p2e = req.body.p2e;
    var user_id = req.body.user_id;
    console.log(p2e);

    var pmp_id = p2e._id;
    if (!pmp_id) {
        return res.json({
            code: -1,
            text: '未有p2e的id'
        });
    }
    if (!user_id) {
        return res.json({
            code: -1,
            text: '未有userid'
        })
    }

    Paper2exam.findById(pmp_id, function (err, p2exam) {
        if(!err){
            var topic_ids = p2exam.topics.map(function (pm) {
                return pm._id;
            });

            console.log(topic_ids, 'this is topic ids!')

            //var query = {
            //    $and: [
            //        {
            //            'userid': user_id
            //        },
            //        {
            //            topics: {
            //                $elemMatch: {
            //                    _id: {$in: topic_ids}
            //                }
            //            }
            //        }
            //    ]
            //};
            Paper2exam
                .aggregate(
                [
                    {
                        "$match": {

                            $and: [
                                {
                                    "userid": parseInt(user_id)
                                }
                                ,
                                {
                                    "topics": {
                                        $elemMatch: {
                                            _id: {
                                                $in: topic_ids.map(function (tid) {
                                                    return new mongoose.Types.ObjectId(tid);
                                                })
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                    ,
                    {
                        $unwind: "$topics"
                    },
                    {
                        $match: {
                            'topics._id': {
                                $in: topic_ids.map(function (tid) {
                                    return new mongoose.Types.ObjectId(tid);
                                })
                            }
                        }
                    }
                    ,
                    {
                        $project: {
                            _id: '$topics._id',
                            name: '$topics.name',
                            correct: '$topics.correct'
                        }
                    }
                    ,
                    {
                        $group: {
                            _id: '$_id',
                            total: {
                                $sum: 1
                            }
                            ,
                            correct: {
                                $sum: {
                                    $cond: [
                                        {
                                            $and:[
                                                {
                                                    $eq: ['$correct', 1]
                                                }
                                            ]
                                        }
                                        ,1,0
                                    ]
                                }
                            }
                        }
                    }
                    //,
                    //{
                    //    $group: {
                    //        _id: {
                    //            _id: '$_id',
                    //            correct: '$correct'
                    //        },
                    //        count: {
                    //            $sum: 1
                    //        }
                    //    }
                    //}
                    //,
                    //{
                    //    $project: {
                    //        _id: '$_id._id',
                    //        correct: '$_id.correct',
                    //        count: '$count'
                    //    }
                    //}
                    //,
                    //{
                    //    $group: {
                    //        _id: {
                    //            _id: '$_id',
                    //            correct: '$correct'
                    //        },
                    //        total: {
                    //            $sum: '$count'
                    //        }
                    //    }
                    //}
                    //,
                    //{
                    //    $group: {
                    //        _id: {
                    //            _id:'$_id',
                    //            correct: '$correct'
                    //        },
                    //        //correct: {
                    //        //    $sum: '$correct'
                    //        //},
                    //        count: {
                    //            $sum: 1
                    //        }
                    //        //{
                    //        //    $sum: {
                    //        //        $cond: [
                    //        //            {
                    //        //                $and:[
                    //        //                    {
                    //        //                        $eq: ['$correct', 1]
                    //        //                    }
                    //        //                ]
                    //        //            }
                    //        //            ,1,0
                    //        //        ]
                    //        //    }
                    //        //}
                    //        //,
                    //        //correct: {
                    //        //    $sum: {
                    //        //        $eq: {
                    //        //            '$correct' : 1
                    //        //        }
                    //        //    }
                    //        //}
                    //    }
                    //}

                    //,
                    //{
                    //    $group:{
                    //        _id:"$_id"
                    //        //,
                    //        //correct: "$correct"
                    //    }
                    //}

                    //,
                    //{
                    //    $project: {
                    //        topics: {
                    //            $filter: {
                    //                input: '$topics',
                    //                as: 'topic',
                    //                cond: {
                    //                    '$$topic._id':{
                    //                        $in: topic_ids.map(function(tid){
                    //                            return new mongoose.Schema.Types.ObjectId(tid);
                    //                        })
                    //                    }
                    //                }
                    //            }
                    //        }
                    //    }
                    //}


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
                    //    { $sample: { size: 1 } }
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
                ], function (err, p2exam1) {
                    if (!err) {

                        var keyed = _.keyBy(p2exam1, '_id');

                        Mistake.findById(pmp_id, function (err, p2e) {
                            if(!err) {
                                console.log(p2e, 'this is p2e!-- -- - - - -- - --');
                                if(!p2e) {
                                    console.log('in p2e!-- -- - - - -- - --');
                                    var mistake = new Mistake({
                                        _id: pmp_id,
                                        name: p2exam.name,
                                        desc: p2exam.desc,
                                        //0.根据生成器生成的题库 1.题库 2.错题库
                                        //type: { type: Number, default: 2 },
                                        //createTime: { type: Date, default: Date.now  },
                                        //lastEdit: { type: Date, default: Date.now },//当你插入文档，自动就会生成日期
                                        //topicNO: { type: Number, default: 0},
                                        authorid: p2exam.authorid,
                                        userid: p2exam.userid,
                                        classid: p2exam.classid,
                                        generator: p2exam.generator,
                                        topics: p2exam.topics,
                                        imgs: []
                                    });

                                    for (var i = 0; i < mistake.topics.length; i++) {
                                        mistake.topics[i].correctNO = keyed[mistake.topics[i]._id].correct;
                                        mistake.topics[i].total = keyed[mistake.topics[i]._id].total;
                                        mistake.mistakes.push(mistake.topics[i].answers);
                                    }

                                    mistake.save(function(err, mis) {
                                        if(!err){
                                            res.json({code:1,text:'mistake new true',data:mis})
                                        }else{
                                            res.json({code:-1,text:'mistake save err'})
                                        }
                                    });
                                }else {
                                    console.log(p2e, 'this is nononono miskekekekekek');

                                    for(var i=0;i<p2exam.topics.length;i++) {
                                        var tmp_id = p2exam.topics[i]._id;
                                        if(_.some(p2e.topics,['_id',tmp_id])) {
                                            console.log('exsits -id')

                                            p2e.topics.id(tmp_id).total = keyed[tmp_id].total;
                                            p2e.topics.id(tmp_id).correctNO = keyed[tmp_id].correctNO;
                                            p2e.topics.id(tmp_id).mistakes.push(p2exam.topics[i].answers);
                                        }else{
                                            console.log('no exsits -id')
                                            var topic = p2exam.topics[i];
                                            topic.total = keyed[tmp_id].total;
                                            topic.correctNO = keyed[tmp_id].correctNO;
                                            p2e.topics.push(topic);
                                        }
                                    }
                                }
                            }else {
                                res.json({code:-1,text:'mistake fool'})
                            }
                        });
                        res.json({code: 1, text: 'success', data: keyed})
                    } else {
                        res.json({code: -1, text: '错误', data: err})
                    }
                });
        }else {
            res.json({code:-1,text:'p2exam fail'})
        }

    });


})


//分析数据
router.post('/u_mark2', function (req, res, next) {
    var p2e = req.body.p2e;
    var user_id = req.body.user_id;
    console.log(p2e);

    var pmp_id = p2e._id;
    if (!pmp_id) {
        return res.json({
            code: -1,
            text: '未有p2e的id'
        });
    }
    if (!user_id) {
        return res.json({
            code: -1,
            text: '未有userid'
        })
    }

    Paper2exam.findById(pmp_id, function (err, p2exam) {
        if (!err) {
            if (p2exam.status == 0) {

                console.log(p2exam, 'this is p2exam');
                p2exam.topics = p2e.topics;
                for (var i = 0; i < p2e.topics.length; i++) {
                    if (p2exam.topics[i].answers.sort().toString() == p2exam.topics[i].trueanswers.sort().toString()) {
                        p2exam.topics[i].correct = 1;
                    }
                }
                p2exam.status = 1;
                p2exam.finishTime = new Date();
                p2exam.save(function (err, p2exam1) {
                    if (!err) {
                        console.log(p2exam1, 'this is p2exam1')
                        res.json({code: 1, text: '返回成功！', data: p2exam1})
                    } else {
                        res.json({code: -1, text: '提交失败', data: err});
                    }
                });
            } else if (p2exam.status == 1) {
                return res.json({code: -1, text: '已提交过', data: p2exam});
            }
        } else {
            res.json({code: -1, text: '提交失败', data: err})
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


module.exports = router;