/**
 * Created by kevin on 16/5/23.
 */
var mongoose = require('mongoose');
var moment = require('moment');


var exam_gSchema = new mongoose.Schema({
    name: String,
    desc: String,
    paper_ids: [mongoose.Schema.Types.Mixed],
    class_ids: [mongoose.Schema.Types.Mixed],
    author_id: {
        type: Number,
        required: true
    },
    topic_count: { type: Number, default: 0 },
    generator: {
        type: String
    },
    create_time: {
        type: Date, default: Date.now
    },
    open_time: {
        type: Date
    },
    close_time: {
        type: Date
    }
});

mongoose.model('Exam_g', exam_gSchema);