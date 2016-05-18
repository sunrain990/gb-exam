/**
 * Created by kevin on 16/5/18.
 */
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/part10');

var ResellerSchema = new mongoose.Schema({
    address: String
});

ResellerSchema.post('save', function(next) {
    console.log('this is ResellerSchema post save middleware');
    next();
});

ResellerSchema.pre('save', true, function(next, done) {
    console.log('this is ResellerSchema pre save middleware');
    next();
    done();
})

var Reseller = mongoose.model('Reseller', ResellerSchema);

var reseller = new Reseller({
    address: '101st, People Read'
});

reseller.save();