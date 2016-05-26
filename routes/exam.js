/**
 * Created by kevin on 16/5/17.
 */
var express = require('express');
var router = express.Router();
var _ = require('lodash');

var AZSort = require('../utils/AZSort');

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Paper = mongoose.model('Paper');
var Topic = mongoose.model('Topic');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Exam' });
});


// new and select
router.post('/c', function(req, res, next){
    var paper = req.body.paper;
    console.log(paper);

    var limit = paging.limit;
    var page = paging.page;

    if(!paper){
        return res.json({code:-1,text:'失败，未有paper对象'});
    }

    if(!paper.id){
        return res.json({code:-1,text:'失败，未有paperid'});
    }

    if(paper.id == 0){
        var paperO = new Paper({
            name: '',
            desc: '',
            type: 1,
            //createTime: { type: Date, default: Date.now  },
            //lastEdit: { type: Date, default: Date.now },//当你插入文档，自动就会生成日期
            //topicNO: { type: Number, default: 0},
            authorid: paper.authorid,
            imgs: [],
            //topics: []
        });


        paperO.save(function (err, doc) {
            if (err) {
                res.json({code:-1,text:err});
                return next();
            } else{
                console.log(doc);
                res.json({code:1,text:'新建成功',data:doc,  paging: {
                    total: 0,
                    limit: limit,
                    page: page
                }});
            }
        });


        //var query = {
        //    mission: 'impossible'
        //};
        //var options = { upsert: true };
        //Paper.findOneAndUpdate(query, paper, options, function(err, doc){
        //    if(!err){
        //        console.log(doc)
        //        res.json({code:1,text:doc})
        //    }else{
        //        console.log(err);
        //        res.json({code:-1,text:err});
        //    }
        //});
    }else{
        var id = paper.id;

        var paging = req.body.paging;

        var limit = paging.limit;
        var page = paging.page;

        var query = {
            _id: id
        };
        console.log(query, 'this is query');

        Paper.findById(id,function(err, paperdoc) {
            if(!err){
                console.log(paperdoc, ' - -- - - - findbyid  paper!');


                Paper
                    .findOne(query)
                    .populate({
                        path: 'topics',
                        options: {
                            limit: limit,
                            sort: {
                                time: -1
                            },
                            skip: (page-1)*limit
                        }
                    })
                    .exec(function(err, paper){
                        if(!err){
                            console.log(paper)
                            res.json({
                                code:1,
                                text:'返回查询成功',
                                data:paper,
                                paging: {
                                    total: paperdoc.topics.length,
                                    limit: limit,
                                    page: page
                                }
                            })
                        }else{
                            console.log(err);
                            res.json({code:-1,text:err});
                        }
                    });


            }else {
                console.log(err);
                res.json({code:1,text:'分页查询错误'})
            }
        });


        //Paper.findOne(query, function(err, doc){
        //    if(!err){
        //        console.log(doc)
        //        res.json({code:1,text:'返回查询成功',data:doc})
        //    }else{
        //        console.log(err);
        //        res.json({code:-1,text:err});
        //    }
        //});
    }
})


router.post('/r', function(req, res, next){
    var id = req.body.paper.id;

    var query = {
        _id: id
    };
    Paper.findOne(query, function(err, doc){
        if(!err){
            console.log(doc)
            res.json({code:1,text:'返回查询成功',data:doc})
        }else{
            console.log(err);
            res.json({code:-1,text:err});
        }
    });
});

router.post('/u', function(req, res, next){
    var paper = req.body.paper;
    console.log('reqbody,u',paper);
    var id = paper.id;
    //Model.findById(id, function (err, doc) {
    //    if (err) ..
    //    doc.name = 'jason borne';
    //    doc.save(callback);
    //});
    var options = {
        new: true
    };
    Paper.findByIdAndUpdate(id, paper, options, function(err, doc){
        if(!err){
            console.log(doc);
            res.json({code:1,text:'保存成功!',data:doc})
        }else{
            console.log(err);
            res.json({code:-1,text:'查询或更新失败',data:err})
        }
    })
})

router.post('/d', function(req, res, next){
    var paper = req.body.paper;
    console.log('reqbody,u',paper);
    var id = paper.id;
    //Model.findById(id, function (err, doc) {
    //    if (err) ..
    //    doc.name = 'jason borne';
    //    doc.save(callback);
    //});
    var options = {
        //new: true
    };
    Paper.findByIdAndRemove(id, options, function(err, doc){
        if(!err){
            console.log(doc);
            res.json({code:1,text:'查询并删除成功',data:doc})
        }else{
            console.log(err);
            res.json({code:-1,text:'查询或删除失败',data:err})
        }
    })
})

router.post('/addtopic', function(req, res, next) {
    var paper = req.body.paper;
    console.log(paper,'this is paper');

    var paperid = paper.id;
    var authorid = paper.authorid;

    if(!paperid){
        return res.json({code:-1,text:'未传有paperid'});
    }else if(!authorid){
        return res.json({code:-1,text:'未传authorid'});
    }
    var optionnums = req.body.optionnums;
    if(!optionnums){
        optionnums = 4;
    }
    if(optionnums>26){
        return res.json({code:-1,text:'传的值不能大于26个字母的长度'});
    }

    var optchoices = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var substroptchoices = optchoices.substr(0, optionnums);

    var options = [];
    for(var i=0;i<substroptchoices.length;i++){
        var tmpobj = {};
        tmpobj.name = substroptchoices[i];
        tmpobj.content = "";
        tmpobj.desc = "";
        tmpobj.answer = 0;
        tmpobj.imgs = [];
        options.push(tmpobj);
    }

    console.log('this is options ------->', options);

    Paper.findById(paperid, function(err, doc){
        if(!err){

            var topic = new Topic({
                name: '',
                desc: '',
                type: 0,
                answers: [],
                options: options,
                imgs: [],
                paperid: paperid,
                authorid: authorid
            });

            topic.save(function(err, topicdoc) {
                if(!err){
                    console.log(topicdoc, 'this is topicdoc');
                    doc.topics.push(topicdoc);

                    doc.save(function(err, doc){
                        if(!err){
                            console.log(doc,'this is doc');
                            //doc.topics.id()
                            res.json({code:1,text:'查询并更新成功',data:topicdoc})
                        }else{
                            res.json({code:-1,text:'save失败',data:err})
                        }
                    });
                }else {
                    console.log(err);
                    res.json({code: -1, text: 'topic save出错',data:err});
                }
            })

            //var obj = {
            //    desc: '',
            //    name: '',
            //    type: 0,
            //    answers: [],
            //    options: options,
            //    imgs: []
            //};
            //

            //var sub = doc['topics'].create(obj);
            //doc['topics'].push(sub);
        }else{
            console.log(err);
            res.json({code:-1,text:'查询或更新失败',data:err})
        }
    })
})

router.post('/getpapers', function(req, res, next) {
    var authorid = req.body.authorid;
    if(!authorid){
        return res.json({code:-1,text:'未传authorid'})
    }
    Paper.find({authorid:authorid},function(err, doc) {
        res.json({code:1,text:'返回authorid',data:doc})
        console.log(doc);
    });
});








router.post('/doption1',function(req, res, next) {
    var paper = req.body.paper;
    var id = paper._id;
    var topic_id = paper.topic_id;
    var option_id = paper.option_id;
    Paper.findById(id,function (err,doc){
        if(!err){
            console.log(id,topic_id,option_id);
            var sub = doc.topics.id(topic_id);
            console.log(sub ,'lueluelue sub!!!!');
            //doc.topics.pull({_id:topic_id});
            var options =  doc.topics.id(topic_id).options;
            console.log(options,'this options');

            var char = doc.topics.id(topic_id).options.id(option_id).name;

            var dropedoptions = _.remove(options, function(o) {
                console.log(o.id,'-------',option_id);
                return o._id != option_id ;
            });
            console.log(dropedoptions,'this droped');

            doc.topics.id(topic_id).options = AZSort(dropedoptions,char);

            doc.save(function(err, doc){
                if(!err){
                    console.log(doc);
                    res.json({code:1,text:'查询并删除option_id成功',data:doc})
                }else{
                    res.json({code:-1,text:'查询并删除option_id失败',data:err})
                }
            });
            //res.json({code:1,text:'find成功！',data:doc})
        }else{
            console.log(err);
            res.json({code:-1,text:'find失败'})
        }
    });
});

router.post('/doption',function(req, res, next) {
    var paper = req.body.paper;
    var id = paper._id;
    var topic_id = paper.topic_id;
    var option_id = paper.option_id;
    var char = paper.char;

    Topic.findById(topic_id, function(err, doc) {
        if(!err) {
            doc.options.pull(option_id);
            doc.options = AZSort(doc.options, char);

            doc.save(function(err, doc) {
                if(!err) {
                    res.json({code:1,text:'删除选项成功',data:doc})
                }else {
                    res.json({code:-1,text:'删除选项失败',data:err})
                }
            });
        }else {
            res.json({code:-1, text: '删除失败', data: err});
        }
    });

    //Paper.findById(id,function (err,doc){
    //    if(!err){
    //        var sub = doc.topics.id(topic_id);
    //
    //        doc.topics.id(topic_id).options.pull(option_id);
    //
    //        doc.topics.id(topic_id).options = AZSort(doc.topics.id(topic_id).options,char);
    //
    //        doc.save(function(err, doc){
    //            if(!err){
    //                res.json({code:1,text:'查询并删除option_id成功',data:doc})
    //            }else{
    //                res.json({code:-1,text:'查询并删除option_id失败',data:err})
    //            }
    //        });
    //        //res.json({code:1,text:'find成功！',data:doc})
    //    }else{
    //        console.log(err);
    //        res.json({code:-1,text:'find失败'})
    //    }
    //});
});


router.post('/coption',function(req, res, next) {
    var paper = req.body.paper;
    var id = paper._id;
    var topic_id = paper.topic_id;

    Topic.findById(topic_id, function(err, doc) {
        if(!err) {
            var name = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[doc.options.length];
            console.log('this is letter', name);
            var option = {
                name: name,
                content: '',
                desc: '',
                answer: 0,
                imgs: []
            };

            var sub = doc.options.create(option);

            doc.options.push(sub);

            doc.save(function(err, doc) {
                if(!err) {
                    console.log(doc);
                    res.json({code:1, text: '添加选项成功', data: sub});
                } else {
                    res.json({code:-1, text: '查询并添加option失败', data:err});
                }
            })
        }else {
            console.log(err);
            res.json({code: -1, text: '添加选线失败', data: err});
        }
    });


    //Paper.findById(id,function (err,doc) {
    //    if (!err) {
    //        var name = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[doc.topics.id(topic_id).options.length];
    //        console.log('this is letter', name);
    //        var option = {
    //            name: name,
    //            content: '',
    //            desc: '',
    //            answer: 0,
    //            imgs: []
    //        };
    //
    //        var sub = doc['topics'].id(topic_id).options.create(option);
    //
    //        doc.topics.id(topic_id).options.push(sub);
    //
    //        doc.save(function (err, doc) {
    //            if (!err) {
    //                console.log(doc);
    //                res.json({code: 1, text: '查询并添加option成功', data: sub})
    //            } else {
    //                res.json({code: -1, text: '查询并添加option失败', data: err})
    //            }
    //        });
    //    } else {
    //        console.log(err);
    //        res.json({code: -1, text: 'find失败'})
    //    }
    //});
});

router.post('/dtopic',function(req, res, next) {
    var paper = req.body.paper;
    var id = paper._id;
    var topic_id = paper.topic_id;
    Paper.findById(id,function (err,doc){
        if(!err){
            console.log(doc);
            doc.topics.pull({_id:topic_id});

            doc.save(function(err, doc){
                if(!err){
                    console.log(doc);

                    Topic.findByIdAndRemove(topic_id, function(err, topicdoc) {
                        if(!err){
                            console.log(topicdoc,'this is removed topicdoc');
                            res.json({code:1,text:'删除选项成功',data:doc})
                        }else {
                            console.log(err)
                            res.json({code:-1,text:'删除选项失败',data:err})
                        }
                    });

                }else{
                    res.json({code:-1,text:'删除选项失败',data:err})
                }
            });
            //res.json({code:1,text:'find成功！',data:doc})
        }else{
            console.log(err);
            res.json({code:-1,text:'删除选项失败',data:err})
        }
    });
});

router.post('/finishtopic',function(req, res, next) {
    var paper = req.body.paper;
    var id = paper._id;
    var topic = paper.topic;
    var topic_id = topic._id;
    var status = paper.status;

    topic.answers = [];
    console.log(topic.imgs, 'this is topic imgs!');
    topic.status = status;


    if(topic.imgs){

        for(var i=0;i<topic.imgs.length;i++){
            console.log(topic.imgs[i],'before');
            delete topic.imgs[i]['$$hashKey'];
            console.log(topic.imgs[i],'after');
            //var jsontmp = JSON.stringify(topic.imgs[i]);
            //
            //console.log(jsontmp,'--------------');
            //
            //delete jsontmp
            //topictmp.push(JSON.parse(jsontmp));
            //console.log(topictmp,'this is topictmp');
        }
    }
    console.log(topic);
    //
    for(var i=0;i<topic.options.length;i++){
        delete topic.options[i]['$$hashKey'];
        if(topic.options[i].answer == 1){
            topic.answers.push(topic.options[i].name);
        }
    }

    delete topic['_id'];

    console.log(topic,'faaafter');

    var options = {
        new: true
    };

    console.log(topic_id, 'this is topic_id');

    Topic.findByIdAndUpdate(topic_id, topic, options, function(err, doc){
        if(!err){
            console.log(doc);
            res.json({code:1,text:'保存题目成功!',data:doc})
        }else{
            console.log(err);
            res.json({code:-1,text:'保存题目失败',data:err})
        }
    });

    //Paper.findOneAndUpdate(
    //    {"_id": id,"topics._id": topic._id},
    //    {
    //        "$set": {
    //            "topics.$": topic
    //        }
    //    },
    //    function(err, doc) {
    //        if(!err){
    //            //console.log(doc);
    //            res.json({code:1,text:'完成状态更新成功',data:topic})
    //        }else{
    //            res.json({code:-1,text:'完成状态更新失败',data:err})
    //        }
    //    }
    //);


    //Paper.findById(id,function (err,doc){
    //    if(!err){
    //        console.log('-----doc!',doc);
    //
    //        for(var i=0;i<doc.topics.length;i++){
    //            (function(i){
    //                if(doc.topics[i]._id = topic._id){
    //                    //console.log('this is  finish_id',topic);
    //                    topic.status = 1;
    //                    console.log(i,'----this is i!!!!', topic._id, doc.topics[i]._id);
    //                    doc.topics[i] = topic;
    //                }
    //            })(i);
    //        }
    //
    //        console.log(doc,'then');
    //
    //        doc.save(function(err, doc){
    //            if(!err){
    //                //console.log(doc);
    //                res.json({code:1,text:'完成状态更新成功',data:topic})
    //            }else{
    //                res.json({code:-1,text:'完成状态更新失败',data:err})
    //            }
    //        });
    //    }else{
    //        //console.log(err);
    //        res.json({code:-1,text:'find失败'})
    //    }
    //});
});


router.post('/edittopic',function(req, res, next) {
    var paper = req.body.paper;
    var id = paper._id;
    var topic_id = paper.topic_id;
    var status = paper.status;

    console.log(id,status,topic_id);

    var options = {
        new: true
    };

    Topic.findByIdAndUpdate(topic_id, {status:0}, options, function(err, doc){
        if(!err){
            console.log(doc);
            res.json({code:1,text:'编辑题目成功!',data:doc})
        }else{
            console.log(err);
            res.json({code:-1,text:'编辑题目失败',data:err})
        }
    });

    //Paper.findOneAndUpdate(
    //    {"_id": id,"topics._id": topic_id},
    //    {
    //        "$set": {
    //            "topics.$.status": status
    //        }
    //    },
    //    function(err, doc) {
    //        if(!err){
    //            //console.log(doc);
    //            res.json({code:1,text:'完成状态更新成功',data:doc})
    //        }else{
    //            res.json({code:-1,text:'完成状态更新失败',data:err})
    //        }
    //    }
    //);
});

module.exports = router;