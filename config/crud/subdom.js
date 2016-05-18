/**
 * Created by kevin on 16/5/17.
 */
var mongoose = require('mongoose')
var childSchema = new mongoose.Schema({ name: 'string' });
var parentSchema = new mongoose.Schema({
    time: {type:Date,default:Date.now},
    children: [childSchema]
})

var Parent = mongoose.model('Parent', parentSchema);
var parent = new Parent({ children: [{ name: 'Matt' }, { name: 'Sarah' }] })
parent.children[0].name = 'Matthew';
parent.save();