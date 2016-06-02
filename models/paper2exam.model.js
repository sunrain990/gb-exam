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
        options: [ Paper2examOptionSchema ],
        status: { type: Number, default: 0 },
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
    lastEdit: { type: Date, default: Date.now },//当你插入文档，自动就会生成日期
    topicNO: { type: Number, default: 0},
    authorid: { type: Number, default: 0},
    userid: { type: Number, required: true },
    classid: { type: Number, required: true },
    generator: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Exam_g'
    },
    topics: [ Paper2examTopicSchema ],
    imgs: [ mongoose.Schema.Types.Mixed ]
}
//, {versionKey:false}//这个就是处理掉自动插入文档的__v这个属性
);

var Paper2exam = mongoose.model('Paper2exam', Paper2examSchema);