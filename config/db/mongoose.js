/**
 * Created by kevin on 16/5/12.
 */
var mongoose = require('mongoose');
var config = require('../config');

module.exports = function() {
    var db = mongoose.connect(config.mongodb);
    mongoose.connection.on('error', console.error.bind(console, 'mongodb connection error:'))
    require('../../models/user.model.js');
    require('../../models/subdom.model.js');
    require('../../models/paper.model.js');
    console.log('mongoose inited');
    return db;
}