/**
 * Created by kevin on 16/5/12.
 */
var mongoose = require('mongoose');
var config = require('../config');

module.exports = function() {
    var db = mongoose.connect(config.mongodb);
    //mongoose.connection.on('error', console.error.bind(console, 'mongodb connection error:'))
    //mongoose.connection.on('connected', function () {
    //    console.log('Mongoose connected to ' + config.mongodb);
    //});
    //mongoose.connection.on('error',function (err) {
    //    console.log('Mongoose connection error: ' + err);
    //});
    //mongoose.connection.on('disconnected', function () {
    //    console.log('Mongoose disconnected');
    //});

    var mcon = mongoose.connection;

    mcon.on('error',console.error.bind(console, 'connection error:'));

    mcon.once('open', function() {
        console.log('mongoose is connected')
    });

    process.on('SIGINT', function() {
        mongoose.connection.close(function () {
            console.log('Mongoose disconnected through app termination');
            process.exit(0);
        });
    });
    require('../../models/user.model.js');
    //require('../../models/subdom.model.js');
    require('../../models/paper.model.js');
    require('../../models/exam_g.model.js');
    return db;
}