/**
 * Created by kevin on 16/5/23.
 */
var mongoose = require('mongoose');
var moment = require('moment');
var Paper = mongoose.model('Paper');


var exam_gSchema = new mongoose.Schema({
    name: String,
    desc: String,
    type: {
        //0. 随机卷 1. 模版考试
        type: Number, default: 0
    },
    // paper_ids: [mongoose.Schema.Types.Mixed],
    paper_ids: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Paper'
    }],
    class_ids: [mongoose.Schema.Types.Mixed],
    author_id: {
        type: Number,
        required: true
    },
    topic_count: { type: Number, default: 0 },
    generator: {
        type: String
    },
    generated_papers: [
        {
            paper: {
                type: mongoose.Schema.Types.ObjectId, ref: 'Paper'
            },
            choose: {
                type: Boolean, default: false
            }
        }

    ],
    duration: {
        type: String, default: '120'
    },
    create_time: {
        type: Date, default: Date.now
    },
    start_time: {
        type: Date
    },
    end_time: {
        type: Date
    }
});

var Exam_g = mongoose.model('Exam_g', exam_gSchema);

//module.exports = Exam_g;