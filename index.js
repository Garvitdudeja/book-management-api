require('dotenv').config();

const express = require('express');

const mongoose = require('mongoose');



mongoose.connect( process.env.MONGO_URI ,{
     useNewUrlParser: true,
     useCreateIndex: true,
     useUnifiedTopology: true,
     useFindAndModify: false,
 }
).then(() => console.log("connection established!"))
.catch((err) => {console.log(err);});


const database = require('./database')

const ourApp = express();

ourApp.get("/", (req, res) => {

    res.json("server is working");

});


// Route    - /books
// Des      - To get all books
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none

ourApp.get("/books", (req, res) => {

    res.json({ Books: database.Book });

});

// Route    - /books/:isbn
// Des      - To get based on ISBN
// Access   - Public
// Method   - GET
// Params   - isbn
// Body     - none

ourApp.get("/books/:isbn", (req, res) => {

    const sBook = database.Book.filter((book) => book.ISBN === req.params.isbn)
    if (sBook.length === 0) res.json("there is no such book");
    else res.json(sBook);

});

// Route    - /books/category/:c
// Des      - to get a list of books based on category
// Access   - Public
// Method   - GET
// Params   - a
// Body     - none


ourApp.get("/books/category/:category", (req, res) => {
    const getBook = database.Book.filter((book) =>book.category.includes(req.params.category));

    return res.json({ book: getBook });
});

// Route    - /authors
// Des      - To get all authors
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none


ourApp.get("/authors", (req, res) => {
    res.json(database.Author)
});

// Route    - /authors/:authorname
// Des      - To get the author based upon name
// Access   - Public
// Method   - GET
// Params   - authorname
// Body     - none



ourApp.get("/authors/:authorname", (req, res) => {

    const sauthor = database.Author.filter((author) => author.name === req.params.authorname)
    if (sauthor.length === 0)
        res.json("No such author");
    else res.json(sauthor)
});


// Route    - /books/author/:title 
// Des      - To get the list of author based upon book name
// Access   - Public
// Method   - GET
// Params   - title
// Body     - none


ourApp.get("/books/author/:title" ,(req, res) => {
    const authorList= database.Book.filter((book) => book.title == req.params.title)
    res.json(authorList)
})





ourApp.listen(4000, () => console.log("server is running"));