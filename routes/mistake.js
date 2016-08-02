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


router.post('/l', function (req, res, next) {
    var mis = req.body.mis;
    var user_id = mis.user_id;
    var paging = req.body.paging;
    var generator_id = mis.generator_id;
    if (!user_id) {
        return res.json({code: -1, text: '未传user_id'})
    }
    if (!generator_id) {
        return res.json({code: -1, text: '未传generator_id'});
    }

    var page, limit;
    if(!paging) {
        page = 1;
        limit = 10;
    }else {
        page = paging.page;
        limit = paging.limit;
    }
    var pmprocker = req.body.pmprocker;
    console.log(pmprocker, 'this is pmprocker!');
    var cond;
    if (pmprocker == 'true') {
        console.log('true');
        cond = {
            '$eq': ['$$topic.favor', true]
        }
    } else if ( pmprocker == 'false'){
        console.log('false');
        cond = {
            '$eq': [ '$$topic.last', false]
        };
    } else if ( pmprocker == 'all') {
        cond = {
            '$or': [
                {
                    '$eq': ['$$topic.favor', true]
                },
                {
                    '$eq': [ '$$topic.last', false]
                }
            ]
        };
    }
    var query = {
        $and: [
            {
                'userid': user_id
            },
            {
                'generator': generator_id
            },
            //{
            //    'topics': {
            //        $elemMatch: {
            //            'correct':  1
            //        }
            //    }
            //}
            //{'topics':{$elemMatch:{'correctNO': 2}}}
        ]
    };

    //,[2,2]  .slice('topics')
    console.log(user_id, generator_id)

    Mistake.aggregate(
        [
            {
                '$match': {
                    $and: [
                        {
                            'userid': parseInt(user_id)
                        },
                        {
                            'generator': new mongoose.Types.ObjectId(generator_id)
                        }
                    ]
                }
            },
            {
                '$project': {
                    '_id': '$_id',
                    'name': '$name',
                    'lastEdit': '$lastEdit',
                    'desc': '$desc',
                    'classid': '$classid',
                    'authorid': '$authorid',
                    'generator': '$generator',
                    topics: {
                        $filter: {
                            input: '$topics',
                            as: 'topic',
                            cond: cond
                        }
                    },
                }
            }
            ,
            {
                '$project': {
                    '_id': '$_id',
                    'name': '$name',
                    'lastEdit': '$lastEdit',
                    'desc': '$desc',
                    'classid': '$classid',
                    'authorid': '$authorid',
                    'generator': '$generator',
                    topics: {
                        $slice:['$topics', (parseInt(page)-1)*parseInt(limit), parseInt(limit)]
                    },
                    paging: {
                        total: {
                            $size: '$topics'
                        }
                    }
                }

            }
            //{
            //    '$unwind': '$topics'
            //},
            //{
            //    '$match': {
            //        'topics.last': {
            //            '$eq': true
            //        }
            //    }
            //}
            //{
            //    '$group': {
            //        '_id': {
            //            '_id': '$_id',
            //            'name': '$name',
            //            'lastEdit': '$lastEdit',
            //            'desc': '$desc',
            //            'classid': '$classid',
            //            'authorid': '$authorid',
            //            'generator': '$generator'
            //        },
            //        'topics': {
            //            '$push': '$topics'
            //        },
            //    }
            //},
            //{
            //    '$project': {
            //        _id: '$_id._id',
            //        authorid: '$_id.authorid',
            //        classid: '$_id.classid',
            //        desc: '$_id.desc',
            //        generator: '$_id.generator',
            //        lastEdit: '$_id.lastEdit',
            //        name: '$_id.name',
            //        topics: '$topics',
            //    }
            //}
        ], function (err, mis) {
            if (!err) {
                console.log(mis);
                res.json({code: 1, text: '返回成功', data: mis[0]});
            } else {
                res.json({code: -1, text: '查询生成器错误', data: err})
            }
        });

    //Mistake.find(query).exec(function(err, mis) {
    //    if(!err) {
    //        var mapedmis = mis.map(function(m) {
    //            return m.
    //        });
    //        console.log(mis);
    //        res.json({code: 1, text: '返回成功', data: mis[0]});
    //    } else {
    //        res.json({code: -1, text: '查询生成器错误', data: err})
    //    }
    //});
});


router.post('/mis_analysis', function(req, res, next) {
    var exam_d = req.body.exam_d;

    var user_id = exam_d.user_id;
    var generator_id = exam_d.generator_id;
    // if (!user_id) {
    //     return res.json({code: -1, text: '未传user_id'})
    // }
    if (!generator_id) {
        return res.json({code: -1, text: '未传generator_id'});
    }
    Mistake.aggregate(
        [
            {
                '$match': {
                    $and: [
                        // {
                        //     'userid': parseInt(user_id)
                        // },
                        {
                            'generator': new mongoose.Types.ObjectId(generator_id)
                        }
                    ]
                }
            },
            {
                '$project': {
                    '_id': '$_id',
                    'name': '$name',
                    'lastEdit': '$lastEdit',
                    'desc': '$desc',
                    'classid': '$classid',
                    'authorid': '$authorid',
                    'generator': '$generator',
                    'userid': '$userid',
                    'papernums': '$papernums',
                    'topicNO': '$topicNO',
                    topics: {
                        $filter: {
                            input: '$topics',
                            as: 'topic',
                            cond: {
                                '$eq': ['$$topic.last', false]
                            }
                        }
                    },
                }
            }
            ,
            {
                '$project': {
                    '_id': '$_id',
                    'name': '$name',
                    'lastEdit': '$lastEdit',
                    'desc': '$desc',
                    'classid': '$classid',
                    'authorid': '$authorid',
                    'generator': '$generator',
                    'userid': '$userid',
                    'papernums': '$papernums',
                    'topicNO': '$topicNO',
                    // topics: {
                    //     $slice:['$topics', (parseInt(page)-1)*parseInt(limit), parseInt(limit)]
                    // },
                    wrong: {
                        $size: '$topics'
                    }
                }
            }

        ], function (err, mis) {
            if (!err) {
                console.log(mis,'this is mis');
                if(mis.length == 0){
                    res.json({
                        code:-1,
                        text: '未有返回,还没有人做题'
                    })
                }else {
                    res.json({
                        code: 1,
                        text: '返回exsits成功'
                        ,
                        data: mis
                    });
                }

            } else {
                res.json({code: -1, text: '查询exsits错误', data: err})
            }
        });
})

router.post('/exsits', function (req, res, next) {
    var mis = req.body.mis;
    var user_id = mis.user_id;
    var paging = req.body.paging;
    var generator_id = mis.generator_id;
    if (!user_id) {
        return res.json({code: -1, text: '未传user_id'})
    }
    if (!generator_id) {
        return res.json({code: -1, text: '未传generator_id'});
    }
    console.log(user_id, generator_id)

    Mistake.aggregate(
        [
            {
                '$match': {
                    $and: [
                        {
                            'userid': parseInt(user_id)
                        },
                        {
                            'generator': new mongoose.Types.ObjectId(generator_id)
                        }
                    ]
                }
            },
        ], function (err, mis) {
            if (!err) {
                console.log(mis,'this is mis');
                if(mis.length == 0){
                    res.json({
                        code:-1,
                        text: '未有该题集返回,可能还没测评'
                    })
                }else {
                    res.json({
                        code: 1,
                        text: '返回exsits成功'
                        // ,
                        // data: mis[0]
                    });
                }

            } else {
                res.json({code: -1, text: '查询exsits错误', data: err})
            }
        });
});


router.post('/r_mis_topic', function (req, res, next) {
    var mis = req.body.mis;
    var user_id = mis.user_id;
    var generator_id = mis.generator_id;
    var topic_id = mis.topic_id;
    if (!user_id) {
        return res.json({code: -1, text: '未传user_id'})
    }
    if (!generator_id) {
        return res.json({code: -1, text: '未传generator_id'});
    }
    if(!topic_id) {
        return res.json({code: -1, text: '未传topic_id'});
    }

    var pmprocker = req.body.pmprocker;

    var query = {
        userid: user_id,
        generator: generator_id
    }

    Mistake.findOne(query, function(err, mis) {
        if(!err) {
            console.log(mis);

            if (pmprocker == 'true') {
                console.log('true');
                mis.topics.id(topic_id).favor = false;
            } else if ( pmprocker == 'false'){
                console.log('false');
                mis.topics.id(topic_id).last = true;
            } else if ( pmprocker == 'all' ) {
                console.log('all');
                mis.topics.id(topic_id).favor = false;
                mis.topics.id(topic_id).last = true;
                // mis.topics.pull(topic_id);
            }

            mis.save(function(err, mis0) {
                if(!err) {
                    res.json({code:1, text: '移除成功！'})
                }else {
                    res.json({code:-1, text: '移除失败！'})
                }
            })
        } else {
            res.json({code: -1, text: '查找topic失败！'})
        }
    })
});

router.post('/favor', function (req, res, next) {
    var mis = req.body.mis;
    var user_id = mis.user_id;
    var generator_id = mis.generator_id;
    var topic_id = mis.topic_id;
    if (!user_id) {
        return res.json({code: -1, text: '未传user_id'})
    }
    if (!generator_id) {
        return res.json({code: -1, text: '未传generator_id'});
    }
    if(!topic_id) {
        return res.json({code: -1, text: '未传topic_id'});
    }

    var query = {
        userid: user_id,
        generator: generator_id
    }

    Mistake.findOne(query, function(err, mis) {
        if(!err) {
            console.log(mis);
            mis.topics.id(topic_id).favor = true;
            mis.save(function(err, mis0) {
                if(!err) {
                    res.json({code:1, text: '收藏成功！', data: mis0})
                }else {
                    res.json({code:-1, text: '收藏失败！'})
                }
            })
        }else {
            res.json({code: -1, text: '查找topic失败！'})
        }
    })
});

router.post('/unfavor', function (req, res, next) {
    var mis = req.body.mis;
    var user_id = mis.user_id;
    var generator_id = mis.generator_id;
    var topic_id = mis.topic_id;
    if (!user_id) {
        return res.json({code: -1, text: '未传user_id'})
    }
    if (!generator_id) {
        return res.json({code: -1, text: '未传generator_id'});
    }
    if(!topic_id) {
        return res.json({code: -1, text: '未传topic_id'});
    }

    var query = {
        userid: user_id,
        generator: generator_id
    }

    Mistake.findOne(query, function(err, mis) {
        if(!err) {
            console.log(mis);
            mis.topics.id(topic_id).favor = false;
            mis.save(function(err, mis0) {
                if(!err) {
                    res.json({code:1, text: '取消收藏成功！'})
                }else {
                    res.json({code:-1, text: '取消收藏失败！'})
                }
            })
        }else {
            res.json({code: -1, text: '查找topic失败！'})
        }
    })
});


module.exports = router;