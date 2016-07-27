/**
 * Created by kevin on 16/5/17.
 */

var os = require('os');

var config = {};

function handleError () {

    var ipv4;

    if (os.networkInterfaces().eth1) {
        for (var i = 0; i < os.networkInterfaces().eth1.length; i++) {
            if (os.networkInterfaces().eth1[i].family == 'IPv4') {
                ipv4 = os.networkInterfaces().eth1[i].address;
            }
        }
        var hostname = os.hostname();
        //console.log(hostname,ipv4);
        if (ipv4 == '121.41.41.46') {
            config.mongodb = 'mongodb://localhost/exam';
            console.log('informal');
        } else if (ipv4 == '121.41.123.2') {
            // config.mongodb = 'mongodb://121.41.37.217/exam';
            config.mongodb = 'mongodb://10.168.172.48/exam';
            console.log('formal');
        } else if (ipv4 == '120.26.245.233') {
            config.mongodb = 'mongodb://121.41.41.46/exam';
            console.log('test',config.mongodb);
        } else if (ipv4 == '120.55.90.62') {
            // config.mongodb = 'mongodb://121.41.37.217/exam';
            config.mongodb = 'mongodb://10.168.172.48/exam';
            console.log('node formal',config.mongodb);
        }
    } else if (os.networkInterfaces().lo0) {
        for (var i = 0; i < os.networkInterfaces().lo0.length; i++) {
            if (os.networkInterfaces().lo0[i].family == 'IPv4') {
                ipv4 = os.networkInterfaces().lo0[i].address;
            }
        }
        if (ipv4 == '127.0.0.1') {
            console.log('localhost');
        }
    }
}

handleError();

module.exports = config;