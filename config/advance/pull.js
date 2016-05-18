/**
 * Created by kevin on 16/5/18.
 */
var assert = require('assert');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/gh3341');
mongoose.set('debug', true);

var fuckSchema = new Schema({
   asshole: String
});

var subSchema = new Schema({
    eventId: Number,
    userId: Number,
    user: [ fuckSchema]
});

var UserSchema = new Schema({
    attending: [subSchema]
});

var User = mongoose.model('gh3341', UserSchema);

var x = new User({ attending: [{ eventId: 1, userId: 2 ,user:[{asshole:'black'}]}, { eventId: 2, userId: 2 }] });

console.log(x);
var objId = x.attending[0];
var assId = x.attending[0].user[0]._id;
console.log('this',objId,assId)
var ss = x.attending[1]._id +'';
//x.attending.pull({ user:{_id:assId} });
User.findOneAndUpdate(
    { "attending._id": ss},
    {
        "$push": {
            "attending.$.user": {asshole: 'ohdarkpurple'}
        }
    },
    function(err,user){
        if(!err){
            console.log(err,user,'-----');
        }else {
            console.log(err);
        }
    }
)
console.log(x.attending[0]);
//process.exit(0);
//573c76e2852848d99930bc0c