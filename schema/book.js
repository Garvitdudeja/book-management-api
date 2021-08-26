const mongoose = require('mongoose');

const BookSchema= mongoose.Schema({
    ISBN: {
        type: String,
        required: true
    },
    title: {
        type: String,
        require: true
    },
    authors: [Number],
    language: String,
    pubDate: String,
    numOfPage: Number,
    category: [String],
    publication: Number
});

//creating a book model

const BookModel = mongoose.model('books', BookSchema)

module.exports= BookModel