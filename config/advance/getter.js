/**
 * Created by kevin on 16/5/18.
 */
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/part10');

var User = mongoose.model('User', {
    blog: {
        type: String,
        get: function(url) {
            if(!url) return url;
            if(0 !== url.indexOf('http://') && 0!== url.indexOf('https://'))
                url = 'http://' + url;
            return url;
        }
    }
});

var user = new User({
    blog: 'chensd.com'
});

user.save(function(err) {
    if(err) {
        return console.log('save error:', err)
    }
    console.log('blog url');
})