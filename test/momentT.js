/**
 * Created by kevin on 16/6/7.
 */
var moment = require('moment');


var now = "04/09/2013 15:00:00";
var then = "04/09/2013 14:20:30";
//expected result:
//"00:39:30"
var now = moment("04/09/2013 15:00:00");
var then = moment("04/09/2013 14:20:30");
console.log(moment(moment.duration(now.diff(then))).format("hh:mm:ss"))