/**
 * Created by kevin on 16/5/18.
 */
var mongoose = require('mongoose');

var BookSchema = new mongoose.Schema({
    isbn: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        index: true
    }
})