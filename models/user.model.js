/**
 * Created by kevin on 16/5/12.
 */
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    uid: Number,
    username: String,
    createTime: Date,
    lastLogin: Date
});

mongoose.model('User', UserSchema);