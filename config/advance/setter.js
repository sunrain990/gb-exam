/**
 * Created by kevin on 16/5/18.
 */
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/part10');

var User = mongoose.model('User',{
    nickname: {
        type: String,
        trim: true
    },
    blog: {
        type: String,
        set: function(url) {
            if(!url) return;
            if(0 !== url.indexOf('http://') && 0 !== ur.indexOf('https://')){
                url = 'http://' + url;
            }
            return url;
        }
    }
});

var user = new User({
    nickname: "   Sid   ",
    blog: ''
});

console.log('user:', user);