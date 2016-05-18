/**
 * Created by kevin on 16/5/17.
 */

var mongoose = require('mongoose');

var childSchema = new mongoose.Schema({ name: 'string' });
var parentSchema = new mongoose.Schema({
    time: {type:Date,default:Date.now},
    children: [childSchema]
})

mongoose.model('Parent', parentSchema);