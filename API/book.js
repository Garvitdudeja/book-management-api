const AuthorModel = require("../schema/author");
const BookModel = require("../schema/book");

const Router = require("express").Router();

// Route    - /books
// Des      - To get all books
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none

Router.get("/books", async (req, res) => {
  const getAllBooks = await BookModel.find();
  return res.json(getAllBooks);
});

// Route    - /books/:isbn
// Des      - To get based on ISBN
// Access   - Public
// Method   - GET
// Params   - isbn
// Body     - none

Router.get("/books/:isbn", async (req, res) => {
  const sBook = await BookModel.findOne({ ISBN: req.params.isbn });

  if (!sBook)
    return res.json({ error: `no such book found of ISBN ${req.params.isbn}` });
  return res.json(sBook);
});

// Route    - /books/category/:category
// Des      - to get a list of books based on category
// Access   - Public
// Method   - GET
// Params   - category
// Body     - none

Router.get("/books/category/:category", async (req, res) => {
  getBook = await BookModel.findOne({ category: req.params.category });

  if (!getBook)
    return res.json({
      message: `No book with category : ${req.params.category}`,
    });
  else res.json({ book: getBook });
});


// Route    - /books/updateAuthor/:isbn/:id
// Des      - to update/add new author
// Access   - Public
// Method   - PUT
// Params   - isbn, id
// Body     - none

Router.put("/books/updateAuthor/:isbn/:id", async (req, res) => {
    const { isbn, id } = req.params;
    const getUpdatedBook = await BookModel.findOneAndUpdate(
      {
        ISBN: isbn,
      },
      {
        $addToSet: {
          authors: id,
        },
      },
      {
        new: true,
      }
    );
    if (!getUpdatedBook) return res.json({ error: `NO book with ISBN: ${isbn}` });
    const getUpdatedAuthor = await AuthorModel.findOneAndUpdate(
      {
        id: parseInt(id),
      },
      {
        $addToSet: {
          books: isbn,
        },
      },
      {
        new: true,
      }
    );
    res.json({
      updatedBook: getUpdatedBook,
      updatedAuthor: getUpdatedAuthor,
    });
  });

// Route    - /books/publications/:isbn
// Des      - To get a list of publications based on book ISBN
// Access   - Public
// Method   - GET
// Params   - authorname
// Body     - none

Router.get("/books/publication/:isbn", async (req, res) => {
  Bookisbn = req.params.isbn;
  const getBook = await BookModel.findOne({
    ISBN: Bookisbn,
  });
  if (!getBook) return res.json(`No book with ISBN: ${Bookisbn}`);
  else return res.json({ "Publication ID is": getBook.publication });
});
// Route    - /books/updateTitle/:isbn
// Des      - to update title of book based on isbn
// Access   - Public
// Method   - POST
// Params   - isbn
// Body     - none

Router.post("/books/updateTitle/:isbn/", async (req, res) => {
  const { isbn } = req.params;
  const { title } = req.body;
  console.log(title);
  const getBook = await BookModel.findOneAndUpdate(
    {
      ISBN: isbn,
    },
    {
      title: title,
    },
    {
      new: true,
    }
  );
  if (!getBook) return res.json({ error: `NO book with ISBN: ${isbn}` });

  res.json({
    updatedBook: getBook,
  });
});

// Route    - /books/author/:title
// Des      - To get the list of author based upon book title
// Access   - Public
// Method   - GET
// Params   - title
// Body     - none

Router.get("/books/author/:title", async (req, res) => {
  const getAuthour = await BookModel.findOne({
    title: req.params.title,
  });

  let listauthor = [];
  if (!getAuthour)
    return res.json(`There is no such book with title ${req.params.title}`);
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

Router.post("/books/new", async (req, res) => {
  try {
    const newBook = req.body;
    await BookModel.create(newBook);
    return res.json({ message: "book added successfully" });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

// Route    - /books/delete/:isbn
// Des      - deleting a book based on ISBN
// Access   - Public
// Method   - Delete
// Params   - isbn
// Body     - none

Router.delete("/books/delete/:isbn", async (req, res) => {
  updatedBook = await BookModel.findOneAndDelete({
    ISBN: req.params.isbn,
  });
  if (!updatedBook)
    return res.json({ error: `No book with ISBN: ${req.params.isbn}` });
  else return res.json(updatedBook);
});


module.exports = Router