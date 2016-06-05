/**
 * Created by kevin on 16/5/17.
 */
var mongoose = require('mongoose');
var moment = require('moment');

var OptionSchema = new mongoose.Schema({
    name: String,
    content: String,
    desc: String,
    answer: { type: Number, default: 0 },
    imgs: [mongoose.Schema.Types.Mixed]
});

var TopicSchema = new mongoose.Schema({
        name: { type: String },
        desc: { type: String, default: ''},
        type: { type: Number, default: 0 },
        score: { type: Number, default: 0 },
        time: { type: Date, default: Date.now },
        answers: [mongoose.Schema.Types.Mixed],
        trueanswers: [mongoose.Schema.Types.Mixed],
        options: [OptionSchema],
        status: { type: Number, default: 0 },
        imgs: [ mongoose.Schema.Types.Mixed ],
        paperid: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Paper'
        },
        authorid: {
            type: Number, default: 0,required: true
        }
}
//,{versionKey:false}//这个就是处理掉自动插入文档的__v这个属性
);

var Topic = mongoose.model('Topic', TopicSchema);

var PaperSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    desc: { type: String, default: '' },
        //0.根据生成器生成的题库 1.题库
    type: { type: Number, default: 1 },
    createTime: { type: Date, default: Date.now  },
    lastEdit: { type: Date, default: Date.now },//当你插入文档，自动就会生成日期
    topicNO: { type: Number, default: 0},
    authorid: { type: Number, default: 0},
    generator: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Exam_g'
    },
    topics: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'Topic'
        }
    ],
    imgs: [mongoose.Schema.Types.Mixed]
}
//, {versionKey:false}//这个就是处理掉自动插入文档的__v这个属性
);

var Paper = mongoose.model('Paper', PaperSchema);

//var Exam_g = require('./exam_g.model.js');