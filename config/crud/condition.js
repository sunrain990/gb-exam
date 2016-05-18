/**
 * Created by kevin on 16/5/12.
 */
var mongoose = require('mongoose');

require('./model.js');

var Book = mongoose.model('Book');

var cond = {
  $or: [
      {author: 'Jame'},
      {author: 'Jim'}
  ]
};

Book.find(cond, function(err, docs) {
    if(err) {
        console.log('find by cond err:', err);
        return;
    }
    console.log('cond:', cond, 'result:', docs);
});