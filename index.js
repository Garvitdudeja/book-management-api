require("dotenv").config();

const express = require("express");

//immporting schema

const Book = require("./schema/book");

const Author = require("./schema/author");

const AuthorModel = require("./schema/author");
const Publication = require("./schema/publication");

const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("connection established!"))
  .catch((err) => console.log(err));

const ourApp = express();

ourApp.use(express.json());

const database = require("./database");
const { find } = require("./schema/author");

ourApp.get("/", (req, res) => {
  return res.json("server is working");
});

// Route    - /books
// Des      - To get all books
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none

ourApp.get("/books", async (req, res) => {
  const getAllBooks = await Book.find();
  return res.json(getAllBooks);
});

// Route    - /books/:isbn
// Des      - To get based on ISBN
// Access   - Public
// Method   - GET
// Params   - isbn
// Body     - none

ourApp.get("/books/:isbn", async (req, res) => {
  const sBook = await Book.findOne({ ISBN: req.params.isbn });

  if (!sBook)
    return res.json({ error: `no such book found of ISBN ${req.params.isbn}` });
  return res.json(sBook);
});

// Route    - /books/category/:c
// Des      - to get a list of books based on category
// Access   - Public
// Method   - GET
// Params   - a
// Body     - none

ourApp.get("/books/category/:category", async (req, res) => {
  getBook = await Book.findOne({ category: req.params.category });

  if (!getBook)
    return res.json({
      message: `No book with category : ${req.params.category}`,
    });
  else res.json({ book: getBook });
});

// Route    - /authors
// Des      - To get all authors
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none

ourApp.get("/authors", async (req, res) => {
  getAuthour = await Author.find();

  return res.json(getAuthour);
});

// Route    - /publications
// Des      - To get all publications
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none

ourApp.get("/publications", async (req, res) => {
  getPublication = await Publication.find();
  return res.json(getPublication);
});

// Route    - /publications/:name
// Des      - To get publication based upon name
// Access   - Public
// Method   - GET
// Params   - name
// Body     - none

ourApp.get("/publications/:name", async (req, res) => {
  specificPublication = await Publication.findOne({
    name: req.params.name,
  });

  if (!specificPublication)
    return res.json({
      message: `No such publication with name: ${req.params.name}`,
    });
  else return res.json(specificPublication);
});

// Route    - /authors/:authorname
// Des      - To get the author based upon name
// Access   - Public
// Method   - GET
// Params   - authorname
// Body     - none

ourApp.get("/authors/:authorname", async (req, res) => {
  getAuthour = await Author.findOne({
    name: req.params.authorname,
  });

  return res.json({ author: getAuthour });
});

// Route    - /books/author/:title
// Des      - To get the list of author based upon book name
// Access   - Public
// Method   - GET
// Params   - title
// Body     - none

ourApp.get("/books/author/:title", async (req, res) => {
  const getAuthour = await Book.findOne({
    title: req.params.title,
  });

  let listauthor = [];
  if (!getAuthour)
    return res.json(`There is no such book with title ${req.params.title}`);
  console.log(getAuthor.authors);
  getAuthour.authors.forEach(async (author) => {
    specific = await Author.findOne({
      id: author,
    });

    listauthor.push(specific);
    len = getAuthour.authors.length;
    if (getAuthour.authors[len - 1] == author) res.json(listauthor);
  });
});

// Route    - /books/new
// Des      - adding new book
// Access   - Public
// Method   - Post
// Params   - none
// Body     - none

ourApp.post("/books/new", async (req, res) => {
  try {
    const newBook = req.body;
    await Book.create(newBook);
    return res.json({ message: "book added successfully" });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

// Route    - /authors/new
// Des      - adding new author
// Access   - Public
// Method   - Post
// Params   - none
// Body     - none

ourApp.post("/authors/new", async (req, res) => {
  const newAuthor = req.body;

  try {
    const newAuthor = req.body;
    await Author.create(newAuthor);
    return res.json({ message: "author added succesfully" });
  } catch (error) {
    return res.json({ message: error });
  }
});

// Route    - /publications/new
// Des      - adding new publications
// Access   - Public
// Method   - Post
// Params   - none
// Body     - none

ourApp.post("/publications/new", async (req, res) => {
  const newPublication = req.body;

  try {
    const newPublication = req.body;
    await Publication.create(newPublication);
    return res.json({ message: "Publication added successfully" });
  } catch (error) {}
});

// Route    - /books/delete/:isbn
// Des      - deleting a book based on ISBN
// Access   - Public
// Method   - Delete
// Params   - isbn
// Body     - none

ourApp.delete("/books/delete/:isbn", async (req, res) => {
  updatedBook = await Book.findOneAndDelete({
    ISBN: req.params.isbn,
  });
  res.json(updatedBook);
});

// Route    - /authors/delete/:isbn
// Des      - deleting a author based on ID
// Access   - Public
// Method   - Delete
// Params   - id
// Body     - none

ourApp.delete("/authors/delete/:id", async (req, res) => {
  const updatedAuthor = await AuthorModel.findOneAndDelete({
    id: parseInt(req.params.id),
  });
  if (!updatedAuthor)
    return res.json(`No such author with id: ${req.params.id}`);
  res.json(updatedAuthor);
});

// Route    - /publications/delete/:id
// Des      - deleting a publication based on ID
// Access   - Public
// Method   - Delete
// Params   - id
// Body     - none



ourApp.listen(3000, () => console.log("server is running"));
