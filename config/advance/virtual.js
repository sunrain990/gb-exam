/**
 * Created by kevin on 16/5/18.
 */
var mongoose = require('mongoose');

var PersonSchema = new mongoose.Schema({
   firstName: String,
    lastName: String
});

PersonSchema.virtual('fullName').get(function() {
    return this.firstName + ' ' + this.lastName;
});

PersonSchema.set('toJSON', {
    getters: true,
    virtual: true
})

var Person = mongoose.model('Person', PersonSchema);

var person = new Person({
    firstName: 'Sid',
    lastName: 'Chen'
});

console.log('user fullName:', person.fullName);

console.log('JSON:', JOSN.stringify(person));