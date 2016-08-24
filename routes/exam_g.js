/**
 * Created by kevin on 16/5/26.
 */
var express = require('express');
var router = express.Router();
var _ = require('lodash');

var Mysql = require('../config/db/my');
var moment = require('moment');

var mongoose = require('mongoose');
//var User = mongoose.model('User');
var Paper = mongoose.model('Paper');
var Topic = mongoose.model('Topic');
var Exam_g = mongoose.model('Exam_g');
var Paper2exam = mongoose.model('Paper2exam');
var Mistake = mongoose.model('Mistake');


function Filtermsg(msg) {
    var tmpstr = "";
    for (var i in msg) {
        if (msg[i] == undefined) {
            continue;
        } else if (i == 'id') {
            continue;
        } else if (i.indexOf('time') > -1) {
            msg[i] = moment(msg[i]).format('YYYY-MM-DD HH:mm:ss');
        } else if (i.indexOf('$$') > -1) {
            continue;
        }
        console.log(i, msg[i]);
        tmpstr += " `" + i + "`=" + "'" + msg[i] + "'" + " ,"
    }
    //去and
    var remtmpstr = tmpstr.slice(0, -1);
    return remtmpstr;
}


router.get('/', function (req, res, next) {
    res.json({text: 'welcome to the exam_g router'})
});


router.post('/c', function (req, res, next) {
    var exam_g = req.body.exam_g;

    console.log(exam_g, 'this is exam_g !!!!!!!!!!');

    var generatorid = exam_g._id;

    if (!exam_g) {
        return res.json({code: -1, text: '参数错误！'});
    }

    if (generatorid == 0) {

        var exam_g0 = new Exam_g({
            name: exam_g.name,
            desc: exam_g.desc,
            paper_ids: [],
            class_ids: [],
            author_id: exam_g.author_id,
            topic_count: exam_g.topic_count,
            generator: exam_g.generator,
            generated_papers: []
            //,
            //create_time: {
            //    type: Date, default: Date.now
            //}
            ,
            start_time: exam_g.start_time,
            end_time: exam_g.end_time
        });

        //var paper0 = new Paper();
        exam_g0.save(function (err, doc) {
            if (!err) {
                console.log(doc);
                res.json({code: 1, text: '新建generator成功！', data: doc, paperdoc: []});
            } else {
                res.json({code: -1, text: '新建generator失败！', data: err});
            }
        });


        //Paper.find({
        //    $and: [
        //        {
        //            'authorid': { $in: ['1'] }
        //        },
        //        {
        //            'type': 1
        //        }
        //    ]
        //
        //}, function(err, docs) {
        //    if(!err){
        //        //_(docs).forEach(function(value) {
        //        //    console.log(value,'------');
        //        //});
        //        //
        //        //res.json({code:1, text:'查询generator成功！', data:docs});
        //        //
        //        //
        //        console.log(docs,'t his is docs');
        //        var concatedArr = [];
        //        _(docs).forEach(function(doc) {
        //            console.log(doc,'------');
        //            concatedArr = _.concat(concatedArr,doc.topics);
        //        });
        //        console.log(concatedArr);
        //
        //        res.json({code:1, text:'查询generator成功！', data:concatedArr});
        //
        //    }else {
        //        res.json({code:-1, text: '查询generator失败！', data: err});
        //    }
        //});

        //Paper.find({
        //    $and: [
        //        {
        //            'authorid': { $in: ['1'] }
        //        },
        //        {
        //            'type': 1
        //        }
        //    ]
        //
        //}, function(err, docs) {
        //    if(!err){
        //        console.log(docs,'t his is docs');
        //        var concatedArr = [];
        //        _(docs).forEach(function(doc) {
        //            console.log(doc,'------');
        //            concatedArr = _.concat(doc.topics);
        //        });
        //        console.log(concatedArr);
        //
        //        res.json({code:1, text:'查询generator成功！', data:concatedArr});
        //    }else {
        //        res.json({code:-1, text: '查询generator失败！', data: err});
        //    }
        //});

    } else {
        if (!generatorid) {
            console.log(generatorid, 'thisis generatorid');
            res.json({code: -1, text: '未传generatorid！'})
        } else {
            var query = {
                _id: generatorid
            };
            console.log(query, 'this is query');

            //Exam_g.findById(generatorid,function(err, exam_gdoc) {
            //    if(!err){
            //        res.json({code:1, text:'查询generator成功！', data:exam_gdoc});
            //    }else {
            //        res.json({code:-1, text: '查询generator失败！', data: err});
            //    }
            //});

            //Project.find(query)
            //    .populate({
            //        path: 'pages',
            //        populate: {
            //            path: 'components',
            //            model: 'Component'
            //        }
            //    })
            //    .exec(function(err, docs) {});


            Exam_g
                .findOne(query)
                .populate({
                    path: 'generated_papers',
                    populate: {
                        path: 'paper',
                        model: 'Paper'
                    },
                    options: {
                        //limit: limit,
                        //sort: {
                        //    time: -1
                        //},
                        //skip: (page-1)*limit
                    }
                })
                .exec(function (err, paper) {
                    if (!err) {
                        Paper.find({_id: {$in: paper.paper_ids}, type: 1},function(err, doc) {
                            if(!err) {
                                res.json({
                                    code: 1,
                                    text: '返回查询成功',
                                    data: paper,
                                    paperdoc: doc
                                    //paging: {
                                    //    total: paperdoc.topics.length,
                                    //    limit: limit,
                                    //    page: page
                                    //}
                                });
                            }else {
                                console.log(paper);
                                return res.json({code:-1,text:'paper id find error'});
                            }
                        });

                    } else {
                        console.log(err);
                        res.json({code: -1, text: err});
                    }
                });


            //Paper.find({
            //    $and: [
            //        {
            //            'authorid': { $in: ['1'] }
            //        },
            //        {
            //            'type': 1
            //        }
            //    ]
            //
            //}, function(err, docs) {
            //    if(!err){
            //        _(docs).forEach(function(value) {
            //            console.log(value,'------');
            //        });
            //
            //        res.json({code:1, text:'查询generator成功！', data:docs});
            //    }else {
            //        res.json({code:-1, text: '查询generator失败！', data: err});
            //    }
            //});
        }
    }
});

//router.post('/r', function(req, res, next) {
//    var exam_g = req.body.exam_g;
//
//    //var generatorid = exam_g.id;
//    //
//    //if(!generatorid){
//    //    return res.json({code:-1,text:'未传generatorid！'});
//    //}
//
//    var classid = exam_g.class_id;
//
//    if(!classid){
//        return res.json({code: -1, text: '未传班级id'})
//    }
//
//    console.log(exam_g, classid, 'this is exam_g !!!!!!!!!!');
//    var querySql = 'select * from class_generator where class_id =' + classid;
//    console.log(querySql, '----querysql');
//    Mysql.single.query(querySql, function(err, re){
//        if(!err){
//            console.log('class_id', re);
//            res.json({code:1, text:'查询generator成功！', data:re});
//        }else {
//            res.json({code:-1, text: '查询generator失败！', data: err});
//        }
//    });
//});



router.post('/u', function (req, res, next) {


    var exam_g = req.body.exam_g;

    console.log(exam_g, 'this is exam_g!!!!!!!!!!');

    if (!exam_g) {
        return res.json({code: -1, text: '参数错误！'});
    }

    var generatorid = exam_g._id;

    if (!generatorid) {
        return res.json({code: -1, text: '未传生成器id'});
    }
    delete exam_g._id;

    var options = {
        new: true
    };
    Exam_g.findByIdAndUpdate(generatorid, exam_g, options, function (err, doc) {
        if (!err) {
            console.log(doc);
            res.json({code: 1, text: '保存成功!', data: doc})
        } else {
            console.log(err);
            res.json({code: -1, text: '查询或更新失败', data: err})
        }
    })

    //var updatesql = "update class_generator set "+Filtermsg(exam_g)+" where id ="+generatorid;
    //console.log(updatesql);
    //Mysql.single.query(updatesql,function(err,re){
    //    if(!err){
    //        console.log(re);
    //        return res.json({code:1,text:'编辑返回成功！',data:re});
    //    }else{
    //        return res.json({code:-1,text:'编辑返回失败！',data:err});
    //    }
    //});
});


router.post('/r', function (req, res, next) {
    var exam_g = req.body.exam_g;
    console.log(exam_g, 'this is exam_g!!!!!!!!!!');

    if (!exam_g) {
        return res.json({code: -1, text: '参数错误！'});
    }

    var class_id = exam_g.class_id;

    if (!class_id) {
        return res.json({code: -1, text: '未传班级id'});
    }


    var class_id_arr = [class_id];
    var query = {
        $and: [
            {
                'class_ids': {$in: class_id_arr}
            },
            {
                generated_papers: {
                    $elemMatch: {
                        choose: true
                    }
                }
            }
        ]
    };
    Exam_g
        .find(query)
        .populate({
            path: 'generated_papers',
            populate: {
                path: 'paper',
                model: 'Paper',
                match: {}
            },
            options: {
                //generated_papers: {
                //    $elemMatch: {
                //        choose: true
                //    }
                //}
            }
        }).exec(function (err, docs) {
            if (!err) {
                var filtereddocs = _.filter(docs, function (doc) {
                    return doc.generated_papers.length != 0
                });

                for (var i = 0; i < filtereddocs.length; i++) {
                    var true_generated_papers = _.filter(filtereddocs[i].generated_papers, function (true_generated_paper) {
                        return true_generated_paper.choose == true;
                    });
                    filtereddocs[i].generated_papers = true_generated_papers;
                }

                console.log(docs);
                res.json({code: 1, text: '查询generator成功！', data: filtereddocs});

            } else {
                res.json({code: -1, text: '查询generator失败！', data: err});
            }
        });
});

router.post('/r_ran', function (req, res, next) {
    var exam_g = req.body.exam_g;
    console.log(exam_g, 'this is exam_g!!!!!!!!!!');

    if (!exam_g) {
        return res.json({code: -1, text: '参数错误！'});
    }

    var class_id = exam_g.class_id;

    if (!class_id) {
        return res.json({code: -1, text: '未传班级id'});
    }

    var user_id = exam_g.user_id;
    if(!user_id) {
        return res.json({code: -1, text: '未传用户id'});
    }

    var start_time = exam_g.start_time;
    var end_time = exam_g.end_time;

    var now_time = new Date();
    console.log('this is now !', now_time);

    var class_id_arr = [class_id];
    var query = {
        $and: [
            {
                'class_ids': {$in: class_id_arr}
            },
            {
                //0. 随机卷 1. 模版考试
                'type': 0
            }
            // ,
            // {
            //     'start_time': {
            //         $lte: now_time
            //     }
            // }
            // ,
            // {
            //     'end_time': {
            //         $gte: now_time
            //     }
            // }
            //,
            //{
            //    generated_papers: {
            //        $elemMatch: {
            //            choose: true
            //        }
            //    }
            //}
        ]
    };
    Exam_g
        .find(query)
        .populate({
            path: 'generated_papers',
            populate: {
                path: 'paper',
                model: 'Paper',
                match: {}
            },
            options: {
                //generated_papers: {
                //    $elemMatch: {
                //        choose: true
                //    }
                //}
            }
        }).lean().exec(function (err, docs) {
            if (!err) {
                //var filtereddocs = _.filter(docs, function (doc) {
                //    return doc.generated_papers.length != 0
                //});
                //
                //for (var i = 0; i < filtereddocs.length; i++) {
                //    var true_generated_papers = _.filter(filtereddocs[i].generated_papers, function (true_generated_paper) {
                //        return true_generated_paper.choose == true;
                //    });
                //    filtereddocs[i].generated_papers = true_generated_papers;
                //}
                //
                //console.log(docs);

                for(var i=0;i<docs.length;i++) {
                    console.log(moment(now_time).format('YYYY-MM-DD HH:mm:ss'), moment(docs[i].end_time).format('YYYY-MM-DD HH:mm:ss'));
                    if(docs[i].end_time) {
                        if( moment(now_time).valueOf() < moment(docs[i].end_time).valueOf() ){
                            docs[i].expire = false;
                        } else {
                            docs[i].expire = true;
                        }
                    }else{
                        docs[i].expire = true;
                    }
                    // if( moment(now_time).valueOf() > moment(docs[i].end_time).valueOf()){
                    //     docs[i].expire = true;
                    // }else{
                    //     docs[i].expire = false;
                    // }
                }

                res.json({code: 1, text: '查询generator成功！', data: docs});

            } else {
                res.json({code: -1, text: '查询generator失败！', data: err});
            }
        });
});

router.post('/d', function (req, res, next) {
    var exam_g = req.body.exam_g;
    console.log('reqbody,u', exam_g);
    var _id = exam_g._id;
    //Model.findById(id, function (err, doc) {
    //    if (err) ..
    //    doc.name = 'jason borne';
    //    doc.save(callback);
    //});
    var options = {
        //new: true
    };
    Exam_g.findByIdAndRemove(_id, options, function (err, doc) {
        if (!err) {
            console.log(doc);
            res.json({code: 1, text: '查询并删除成功', data: doc})
        } else {
            console.log(err);
            res.json({code: -1, text: '查询或删除失败', data: err})
        }
    })
})

router.post('/getgenerators', function (req, res, next) {
    var author_id = req.body.authorid;
    if (!author_id) {
        return res.json({code: -1, text: '未传authorid'})
    }
    var classid = req.body.classid;
    if(!classid) {
        return res.json({code: -1, text: '未传classid'});
    }

    var israndom = req.body.israndom;
    console.log(israndom);
    //israndom = israndom?0:1;
    var ran;
    if(israndom == 'false'){
        ran = 1;
    }else if(israndom == 'true') {
        ran = 0;
    }
    console.log(israndom,ran);

    Exam_g.aggregate(
        [
            {
                '$match': {
                    $and: [
                        {
                            'author_id': parseInt(author_id)
                        },
                        {
                            'type': parseInt(ran)
                        },
                        {
                            "class_ids": {
                                $elemMatch: {
                                    $eq: classid
                                }
                            }
                        }
                    ]
                }
            },
            {
                '$lookup': {
                    from: 'paper2exams',
                    localField: "_id",
                    foreignField: "generator",
                    as: "p2es"
                }
            },
            { $sort : { create_time : -1 } }
            ,
            {
                '$limit': 5
            }
            // {
            //     $out: "outgenerators"
            // }
            // {
            //     '$unwind': '$p2es'
            // },
            // {
            //     '$group': {
            //        _id: '$_id',
            //        topicNO: {
            //             $sum: "$p2es.topicNO"
            //        },
            //         correctNO: {
            //             $sum: "$p2es.correctNO"
            //         }
            //        //"userid": "userid"
            //     }
            // }
            // // ,
            // {
            //     '$project': {
            //         topics: "$topics"
            //     }
            // }
        ], function(err, mis) {
            if (!err) {
                console.log(mis);
                var mimi = mis;
                if(mis) {
                    for(var i=0;i<mimi.length;i++) {
                        var correctNO = 0;
                        var topicNO = 0;
                        for(var j=0;j<mimi[i].p2es.length;j++) {
                            if(mimi[i].p2es[j].correctNO) {
                                correctNO += mimi[i].p2es[j].correctNO;
                            }
                            if(mimi[i].p2es[j].topicNO) {
                                topicNO += mimi[i].p2es[j].topicNO;
                            }
                        }
                        mimi[i].correctNO = correctNO;
                        mimi[i].topicNO = topicNO;
                        mimi[i].paperNO = mimi[i].p2es.length;
                        delete mimi[i].p2es;
                    }
                }
                res.json({code: 1, text: '返回成功', data: mimi})
            } else {
                res.json({code: -1, text: '查询生成器错误', data: err})
            }
        }
    );




    // Exam_g.find({author_id: author_id,type: ran}, function (err, doc) {
    //     if (!err) {
    //         console.log(doc);
    //         res.json({code: 1, text: '返回authorid', data: doc})
    //     } else {
    //         res.json({code: -1, text: '查询生成器错误', data: err})
    //     }
    // });
});


router.post('/cexam', function (req, res, next) {
    var exam_g = req.body.exam_g;
    console.log(exam_g, 'this is exam_g!!!!!!!!!!');

    if (!exam_g) {
        return res.json({code: -1, text: '参数错误！'});
    }
    var generatorid = exam_g._id;
    var class_ids = exam_g.class_ids;
    var topic_count = exam_g.topic_count;
    if (!topic_count) {
        topic_count = 10;
    }
    var paper_ids = exam_g.paper_ids;

    var authorid = exam_g.author_id;
    if (!authorid) return res.json({code: -1, text: '未传试卷模版作者id'});
    var authoridArr = [];
    authoridArr.push(authorid);

    var type = exam_g.type;
    console.log(type, 'this is random type');
    if (!type) {
        Paper.find({
            $and: [
                {
                    '_id': {$in: paper_ids}
                },
                {
                    'type': 0
                }
                // 题库由来
                //,{
                //    'paperid': {$in: []}
                //}
            ]
        }).populate({
            path: 'topics',
                //,
                //options: {
                //    limit: limit,
                //    sort: {
                //        time: -1
                //    },
                //    skip: (page-1)*limit
                //}
            //populate: {
            //    path: 'paper',
            //    model: 'Paper',
            //    match: {}
            //},
            options: {
                //generated_papers: {
                //    $elemMatch: {
                //        choose: true
                //    }
                //}
            }
        }).exec(function(err, docs) {
            console.log(docs, 't his is docs');
            var concatedArr = [];
            _(docs).forEach(function (doc) {
                console.log(doc, '------');
                concatedArr = _.concat(concatedArr, doc.topics);
            });
            console.log(concatedArr);


            var sampledArr = _.sampleSize(concatedArr, _.random(topic_count, topic_count));

            res.json({code: 1, text:'ttt', data: sampledArr});

        });


    } else if (type == 1) {
        Paper.find({
            $and: [
                {
                    'authorid': {$in: authoridArr}
                },
                {
                    'type': 1
                }
                // 题库由来
                //,{
                //    'paperid': {$in: []}
                //}
            ]

        }, function (err, docs) {
            if (!err) {
                //_(docs).forEach(function(value) {
                //    console.log(value,'------');
                //});
                //
                //res.json({code:1, text:'查询generator成功！', data:docs});
                //
                //
                console.log(docs, 't his is docs');
                var concatedArr = [];
                _(docs).forEach(function (doc) {
                    console.log(doc, '------');
                    concatedArr = _.concat(concatedArr, doc.topics);
                });
                console.log(concatedArr);


                var sampledArr = _.sampleSize(concatedArr, _.random(topic_count, topic_count));

                var paperO = new Paper({
                    name: '模版',
                    desc: '生成器生成卷' + paper_ids,
                    type: 0,
                    //createTime: { type: Date, default: Date.now  },
                    //lastEdit: { type: Date, default: Date.now },//当你插入文档，自动就会生成日期
                    topicNO: sampledArr.length,
                    authorid: authorid,
                    imgs: [],
                    topics: sampledArr,
                    generated_papers: [],
                    generator: generatorid
                });


                paperO.save(function (err, doc) {
                    if (!err) {
                        console.log(doc);

                        delete exam_g._id;

                        var options = {
                            new: true
                        };

                        if (!exam_g.generated_papers) {
                            exam_g.generated_papers = [];
                        }
                        exam_g.generated_papers.push({
                            paper: doc._id,
                            choose: false
                        });

                        Exam_g.findByIdAndUpdate(generatorid, exam_g, options, function (err, exam_gdoc) {
                            if (!err) {
                                console.log(exam_gdoc, 'exam_gdoc');
                                res.json({
                                    code: 1,
                                    text: '生成试卷成功!' + doc.id,
                                    data: {
                                        paper: doc,
                                        choose: false
                                    }
                                })
                            } else {
                                console.log(err);
                                res.json({code: -1, text: '查询或更新失败', data: err})
                            }
                        })
                    } else {
                        res.json({code: -1, text: err});
                        return next();
                    }
                });

                //res.json({code:1, text:'查询generator成功！', data:concatedArr});

            } else {
                res.json({code: -1, text: '查询generator失败！', data: err});
            }
        });
    }


});

router.post('/dexam', function (req, res, next) {
    var exam_g = req.body.exam_g;
    if (!exam_g) {
        return res.json({code: -1, text: '参数错误！'})
    }
    var _id = exam_g._id;
    if (!_id) {
        return res.json({code: -1, text: '未传generatorid'})
    }
    var choose = exam_g.choose;
    if (!choose) {
        return res.json({code: -1, text: '模版是选中状态，不能删除'})
    }
    var paperid = exam_g.paperid;
    if (!paperid) {
        return res.json({code: -1, text: '未传generatorid'})
    }

    var options = {
        //new: true
    };


    Exam_g.update(
        {_id: _id},
        {$pull: {generated_papers: {paper: paperid}}},
        function (err, numAffected) {
            if (!err) {
                console.log(numAffected);
                res.json({code: 1, text: 'affected!', data: numAffected})
            } else {
                res.json({code: -1, text: 'err', data: err})
            }
        }
    );

    //Exam_g.findById(_id,function(err, exam_gdoc) {
    //    if(!err){
    //
    //        exam_gdoc.generated_papers.pull();
    //
    //        for(var i=0;i<exam_gdoc.generated_papers.length;i++){
    //            if(paperid == exam_gdoc.generated_papers[i].paper){
    //                console.log(paperid,' this is paperid !')
    //                exam_gdoc.generated_papers[i].choose = choose;
    //            }
    //        }
    //        exam_gdoc.save(function(err, doc){
    //            if(!err) {
    //                console.log(doc);
    //                res.json({code:1, text:'更改模版状态成功！', data:exam_gdoc});
    //            }else {
    //                res.json({code:-1, text:'更改模版状态失败！', data: err});
    //            }
    //        });
    //    }else {
    //        res.json({code:-1, text: '查询generator失败！', data: err});
    //    }
    //});
    //Paper.findByIdAndRemove(paperid, options, function(err, doc){
    //    if(!err){
    //        console.log(doc);
    //        res.json({code:1,text:'查询并删除成功',data:doc})
    //    }else{
    //        console.log(err);
    //        res.json({code:-1,text:'查询或删除失败',data:err})
    //    }
    //})

});

router.post('/choosetpl', function (req, res, next) {
    var exam_g = req.body.exam_g;
    if (!exam_g) {
        return res.json({code: -1, text: '参数错误！'})
    }
    var _id = exam_g._id;
    if (!_id) {
        return res.json({code: -1, text: '未传generatorid'})
    }
    var paperid = exam_g.paperid;
    if (!paperid) {
        return res.json({code: -1, text: '未传paperid'})
    }
    var choose = exam_g.choose;

    console.log(choose, 'this is exam_gchoose');

    Exam_g.findById(_id, function (err, exam_gdoc) {
        if (!err) {

            for (var i = 0; i < exam_gdoc.generated_papers.length; i++) {
                if (paperid == exam_gdoc.generated_papers[i].paper) {
                    console.log(paperid, ' this is paperid !')
                    exam_gdoc.generated_papers[i].choose = choose;
                }
            }
            exam_gdoc.save(function (err, doc) {
                if (!err) {
                    console.log(doc);
                    res.json({code: 1, text: '更改模版状态成功！', data: exam_gdoc});
                } else {
                    res.json({code: -1, text: '更改模版状态失败！', data: err});
                }
            });
        } else {
            res.json({code: -1, text: '查询generator失败！', data: err});
        }
    });
});


router.post('/cg', function (req, res, next) {
    var exam_g = req.body.exam_g;

    if (!exam_g) {
        return res.json({code: -1, text: '参数错误！'});
    }

    var class_id = exam_g.class_id;
    if (!class_id) {
        return res.json({
            code: -1,
            text: '没有班级'
        })
    }
    var user_id = exam_g.user_id;
    if (!user_id) {
        return res.json({
            code: -1,
            text: '没有用户'
        })
    }
    var paper_id = exam_g.paper_id;
    if (!paper_id) {
        return res.json({
            code: -1,
            text: '没有试卷'
        })
    }

    //以paperid为模版新建一个试卷副本
    var query = {
        _id: paper_id
    };
    Paper
        .findOne(query)
        .populate({
            path: 'topics'
            //,
            //options: {
            //    limit: limit,
            //    sort: {
            //        time: -1
            //    },
            //    skip: (page-1)*limit
            //}
        })
        .exec(function (err, paper) {
            if (!err) {
                console.log(paper, 'this is paper2exam!');

                //console.log(paper)
                res.json({
                    code: 1,
                    text: '返回查询成功',
                    data: paper
                    //,
                    //paging: {
                    //    total: paperdoc.topics.length,
                    //    limit: limit,
                    //    page: page
                    //}
                })
            } else {
                console.log(err);
                res.json({code: -1, text: err});
            }
        });
    //var updatesql = "update class_generator set "+Filtermsg(exam_g)+" where id ="+generatorid;
    //console.log(updatesql);
    //Mysql.single.query(updatesql,function(err,re){
    //    if(!err){
    //        console.log(re);
    //        return res.json({code:1,text:'编辑返回成功！',data:re});
    //    }else{
    //        return res.json({code:-1,text:'编辑返回失败！',data:err});
    //    }
    //});
});

router.post('/cg_ran', function (req, res, next) {
    var exam_g = req.body.exam_g;

    if (!exam_g) {
        return res.json({code: -1, text: '参数错误！'});
    }

    var class_ids = exam_g.class_ids;
    if (!class_ids) {
        return res.json({
            code: -1,
            text: '没有班级'
        })
    }
    var user_id = exam_g.user_id;
    if (!user_id) {
        return res.json({
            code: -1,
            text: '没有用户'
        })
    }
    var paper_ids = exam_g.paper_ids;
    if (!paper_ids) {
        return res.json({
            code: -1,
            text: '没有试卷'
        })
    }

    var topic_count = exam_g.topic_count;
    var name = exam_g.name;
    var desc = exam_g.desc;
    var author_id = exam_g.author_id;
    var generator_id = exam_g.generator_id;
    var class_id = exam_g.class_id;
    var duration = exam_g.duration;

    //以paperid为模版新建一个试卷副本
    Paper
        .find({
            $and: [
                {
                    '_id': {$in: paper_ids}
                },
                {
                    'type': 1
                }
                // 题库由来
                //,{
                //    'paperid': {$in: []}
                //}
            ]
        })
        .populate({
            path: 'topics'
            //,
            //options: {
            //    limit: limit,
            //    sort: {
            //        time: -1
            //    },
            //    skip: (page-1)*limit
            //}
        })
        .exec(function (err, docs) {
            if (!err) {
                console.log(docs, 'this is paper2exam!');


                var concatedArr = [];
                _(docs).forEach(function (doc) {
                    console.log(doc, '------');
                    concatedArr = _.concat(concatedArr, doc.topics);
                });

                var sampledArr = _.sampleSize(concatedArr, _.random(topic_count, topic_count));
                console.log(sampledArr, 'this is samled aaaaarr');

                //将正确答案计入mark
                var mark = sampledArr.map(function(sampled) {
                    return {
                        _id: sampled._id,
                        answers: sampled.answers
                    }
                });

                var keyed = _.keyBy(mark, '_id');

                //answers清空
                console.log(keyed, 'this is mark---');


                for(var i=0;i<sampledArr.length;i++){
                    for(var j=0;j<sampledArr[i].options.length;j++) {
                        sampledArr[i].options[j].answer = 0;
                    }

                    //sampledArr[i].answers = [];

                    //if(sampledArr.answers) {
                    //    var a = sampledArr.answers.slice();
                    //    console.log(a,'-----')
                    //    sampledArr[i].trueanswers = a;
                    //}
                    sampledArr[i].trueanswers = sampledArr[i].answers;
                    sampledArr[i].answers = [];
                    console.log(sampledArr[i].answers,sampledArr[i].trueanswers,'-----1-1-1-1--1-1-1-')
                }

                var end_time = moment().add(duration,'minutes').format('YYYY-MM-DD HH:mm:ss');
                console.log(' this is end_time ', end_time);

                var paper2exam0 = new Paper2exam({
                    name: name,
                    desc: desc,
                    //随机生成卷
                    type: 0,
                    //结束时间
                    endTime: end_time,
                    //是否完成
                    status: 0,
                    topicNO: topic_count,
                    authorid: author_id,
                    classid: class_id,
                    userid: user_id,
                    duration: duration,
                    generator: generator_id,
                    topics: sampledArr,
                    imgs: [],
                    mark: keyed
                });

                paper2exam0.save(function(err, doc){
                    if(!err) {

                        var query = {
                            generator: generator_id,
                            userid: user_id
                        }

                        Mistake.findOne(query, function (err, mis) {
                            if(!err) {
                                //mis = mis[0];
                                if(!mis) {
                                    console.log('in mis!-- -- - - - -- - --');
                                    var mistake = new Mistake({
                                        //_id: mis_id,
                                        name: doc.name,
                                        desc: doc.desc,
                                        //0.根据生成器生成的题库 1.题库 2.错题库
                                        //type: { type: Number, default: 2 },
                                        //createTime: { type: Date, default: Date.now  },
                                        //lastEdit: { type: Date, default: Date.now },//当你插入文档，自动就会生成日期
                                        //topicNO: { type: Number, default: 0},
                                        authorid: doc.authorid,
                                        userid: doc.userid,
                                        classid: doc.classid,
                                        generator: doc.generator,
                                        topics: doc.topics,
                                        topicNO: doc.topicNO,
                                        imgs: []
                                    });

                                    // for (var i = 0; i < mistake.topics.length; i++) {
                                    //     mistake.topics[i].correctNO = keyed[mistake.topics[i]._id].correct;
                                    //     mistake.topics[i].total = keyed[mistake.topics[i]._id].total;
                                    //     mistake.topics[i].mistakes.push(mistake.topics[i].answers);
                                    //     // 确保是未编辑状态
                                    //     mistake.topics[i].status = 1;
                                    //     if(mistake.topics[i].correct) {
                                    //         mistake.topics[i].last = true;
                                    //     }else {
                                    //         mistake.topics[i].last = false;
                                    //     }
                                    // }

                                    mistake.save(function(err, mis0) {
                                        if(!err){
                                            // return res.json({code:1,text:'mistake new success',data:p2exam0})

                                            console.log(doc, '----->paper2exam doc');
                                            return res.json({
                                                code: 1,
                                                text: '返回查询成功',
                                                data: doc
                                                //,
                                                //sampledArr:sampledArr
                                            })
                                        }else{
                                            return res.json({code:-1,text:'mistake save err'})
                                        }
                                    });
                                }else {
                                    console.log(mis,'yoyoyoyoyooyooyooyoyoy mimimimis');
                                    var misarr = JSON.parse(JSON.stringify(mis.toObject().topics));
                                    var docarr = JSON.parse(JSON.stringify(doc.toObject().topics));
                                    JSON.stringify(misarr)
                                    var unionedTopics = _.unionBy(misarr, docarr, '_id');
                                    console.log(misarr, docarr, unionedTopics, 'this is unionedTopics!!!');
                                    mis.topics = unionedTopics;
                                    mis.save(function(err, mis0) {
                                        if(!err) {
                                            return res.json({code:1,text:'mistake already exists!',data:doc})
                                        }else {
                                            return res.json({code:-1, text:'mistake error', data:err})
                                        }
                                    });
                                    //TODO mistake exits
                                }
                            }else {
                                return res.json({code:-1,text:'mistake fool'})
                            }
                        });
                    }else{
                        return res.json({code:-1,text:'新建考题失败save失败',data:err})
                    }
                })
            } else {
                console.log(err);
                res.json({code: -1, text: err});
            }
        });
    //var updatesql = "update class_generator set "+Filtermsg(exam_g)+" where id ="+generatorid;
    //console.log(updatesql);
    //Mysql.single.query(updatesql,function(err,re){
    //    if(!err){
    //        console.log(re);
    //        return res.json({code:1,text:'编辑返回成功！',data:re});
    //    }else{
    //        return res.json({code:-1,text:'编辑返回失败！',data:err});
    //    }
    //});
});


module.exports = router;