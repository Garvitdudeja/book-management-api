const mongoose = require('mongoose');

const AuthorSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true
    }, 
    name: String,
    books : [String]
});

const AuthorModel = mongoose.model('Author', AuthorSchema)

module.exports = AuthorModel;