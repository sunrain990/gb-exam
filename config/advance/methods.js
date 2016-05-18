/**
 * Created by kevin on 16/5/18.
 */
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/part10');

var BookSchema = new mongoose.Schema({
    name: String,
    isbn: Number
});

// 静态方法
BookSchema.statics.findByISBN = function(isbn, cb) {
    this.findOne({isbn: isbn}, function(err, doc) {
        cb(err, doc);
    });
};

// 实例方法
BookSchema.methods.print = function(){
    console.log('Book information:');
    console.log('\tTitile:', this.name);
    console.log('\tISBN:', this.isbn);
}

var Book = mongoose.model('Book', BookSchema);

var book = new Book({
    name: 'MEAN Web Development',
    isbn: 1000001
});

book.save(function(err){
    if(err) {
        return console.log('save book failed', err);
    }
    Book.findByISBN(1000001, function(err, doc){
        console.log('findByISBN, err, doc:', err, doc);
    });

    book.print();
})