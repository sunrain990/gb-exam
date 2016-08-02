/**
 * Created by kevin on 16/6/12.
 */
var mongoose = require('mongoose');
var moment = require('moment');

var MistakeOptionSchema = new mongoose.Schema({
    name: String,
    content: String,
    desc: String,
    answer: { type: Number, default: 0 },
    imgs: [mongoose.Schema.Types.Mixed]
});

var MistakeTopicSchema = new mongoose.Schema({
        name: { type: String },
        desc: { type: String, default: ''},
        type: { type: Number, default: 0 },
        score: { type: Number, default: 0 },
        time: { type: Date, default: Date.now },
        answers: [mongoose.Schema.Types.Mixed],
        //回答错误的历史答案
        mistakes: [mongoose.Schema.Types.Mixed],
        //是否被收藏
        favor: { type: Boolean, default: false },
        //总共做了几次
        total: { type: Number, default: 0 },
        last: { type: Boolean, default: false },
        correct: { type: Number },
        //正确次数
        correctNO: { type: Number, default: 0 },
        trueanswers: [mongoose.Schema.Types.Mixed],
        options: [MistakeOptionSchema],
        status: { type: Number, default: 0 },
        imgs: [ mongoose.Schema.Types.Mixed ],
        paperid: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Mistake'
        },
        authorid: {
            type: Number, default: 0,required: true
        }
    }
//,{versionKey:false}//这个就是处理掉自动插入文档的__v这个属性
);


var MistakeSchema = new mongoose.Schema({
        name: { type: String, default: '' },
        desc: { type: String, default: '' },
        //0.根据生成器生成的题库 1.题库 2.错题库
        type: { type: Number, default: 2 },
        createTime: { type: Date, default: Date.now  },
        lastEdit: { type: Date, default: Date.now },//当你插入文档，自动就会生成日期
        topicNO: { type: Number, default: 0},
        authorid: { type: Number, default: 0},
        //技术方向
        tecdir: { type: mongoose.Schema.Types.Mixed },
        userid: { type: Number, required: true },
        classid: { type: Number, required: true },
        generator: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Exam_g'
        },
        topics: [MistakeTopicSchema],
        imgs: [mongoose.Schema.Types.Mixed],
        //做试卷数
        papernums: {type: Number, default: 0},
        //试卷题目数
        topicNO: {type: Number, default: 0}
    }
//, {versionKey:false}//这个就是处理掉自动插入文档的__v这个属性
);

var Mistake = mongoose.model('Mistake', MistakeSchema);
