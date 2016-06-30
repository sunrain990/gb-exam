/**
 * Created by kevin on 16/5/17.
 */
var mongoose = require('mongoose');
var moment = require('moment');

var Paper2examOptionSchema = new mongoose.Schema({
    name: String,
    content: String,
    desc: String,
    answer: { type: Number, default: 0 },
    imgs: [ mongoose.Schema.Types.Mixed ]
});

var Paper2examTopicSchema = new mongoose.Schema({
        name: { type: String },
        desc: { type: String, default: ''},
        type: { type: Number, default: 0 },
        score: { type: Number, default: 0 },
        time: { type: Date, default: Date.now },
        answers: [ mongoose.Schema.Types.Mixed ],
        trueanswers: [ mongoose.Schema.Types.Mixed ],
        options: [ Paper2examOptionSchema ],
        total: { type: Number },
        correctNO: { type: Number },
        mistakes: [ mongoose.Schema.Types.Mixed ],
        //是否被收藏
        //favor: { type: Boolean },
        status: { type: Number, default: 0 },
        //题目正确与否 0false
        correct: { type: Number, default: 0 },
        imgs: [ mongoose.Schema.Types.Mixed ],
        paperid: {
            type: mongoose.Schema.Types.ObjectId
        },
        authorid: {
            type: Number, default: 0,required: true
        }
}
//,{versionKey:false}//这个就是处理掉自动插入文档的__v这个属性
);

var Paper2examSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    desc: { type: String, default: '' },
    type: { type: Number, default: 1 },
    createTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    //试卷是否完成
    status: { type: Number, default: 0 },
    //试卷完成时间
    finishTime: { type: Date},
    wasteTime: { type: String },
    duration: {
        type: String, default: '121'
    },
    correctNO: { type: Number },
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
    topics: [ Paper2examTopicSchema ],
    imgs: [ mongoose.Schema.Types.Mixed ],
    //评分标准
    mark: { type: mongoose.Schema.Types.Mixed }
}
//, {versionKey:false}//这个就是处理掉自动插入文档的__v这个属性
);

var Paper2exam = mongoose.model('Paper2exam', Paper2examSchema);