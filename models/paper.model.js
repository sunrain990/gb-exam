/**
 * Created by kevin on 16/5/17.
 */
var mongoose = require('mongoose');
var moment = require('moment');

function dateFilter (val) {
    return moment(val).format('YYYY-MM-DD HH:mm:ss')
}

var optionSchema = new mongoose.Schema({
    name: String,
    content: String,
    desc: String,
    imgs: [mongoose.Schema.Types.Mixed]
});

var topicSchema = new mongoose.Schema({
        name: { type: String },
        desc: { type: String, default: '这是问题描述'},
        type: { type: Number, default: 0 },
        score: { type: Number, default: 0 },
        answers: [mongoose.Schema.Types.Mixed],
        options: [optionSchema],
        imgs: [mongoose.Schema.Types.Mixed]
},
{versionKey:false}//这个就是处理掉自动插入文档的__v这个属性
);

var PaperSchema = new mongoose.Schema({
    name: { type: String, default: '新建试卷' },
    desc: { type: String, default: '这是试卷描述' },
    type: { type: Number, default: 1 },
    createTime: { type: Date, default: Date.now  },
    lastEdit: { type: Date, default: Date.now },//当你插入文档，自动就会生成日期
    topicNO: { type: Number, default: 0},
    authorid: { type: Number, default: 0},
    topics: [topicSchema],
    imgs: [mongoose.Schema.Types.Mixed]
},
{versionKey:false}//这个就是处理掉自动插入文档的__v这个属性
);

mongoose.model('Paper', PaperSchema);