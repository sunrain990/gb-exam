/**
 * Created by kevin on 16/5/12.
 */
var mongoose = require('mongoose');
var url = 'mongodb://username:password@hostname:port/database';
uri = "mongodb://localhost/exam";

mongoose.connect(uri)

var BookSchema = new mongoose.Schema({
    name: String,
    author: String,
    publishTime: Date
});

mongoose.model('Book',BookSchema);