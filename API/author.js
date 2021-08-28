const Router = require("express").Router();
const AuthorModel = require("../schema/author");
const BookModel = require("../schema/book");

// Route    - /authors
// Des      - To get all authors
// Access   - Public
// Method   - GET
// Params   - category
// Body     - none

Router.get("/authors", async (req, res) => {
  getAuthour = await AuthorModel.find();

  return res.json(getAuthour);
});
// Route    - /authors/name/:authorname
// Des      - To get the author based upon name
// Access   - Public
// Method   - GET
// Params   - authorname
// Body     - none

Router.get("/authors/name/:authorname", async (req, res) => {
  const getAuthor = await AuthorModel.findOne({
    name: req.params.authorname,
  });
  if (!getAuthor)
    return res.json({ error: `No author with name ${req.params.authorname}` });
  return res.json({ author: getAuthor });
});
// Route    - /authors/id/:authorid
// Des      - To get the author based upon id
// Access   - Public
// Method   - GET
// Params   - authorname
// Body     - none

Router.get("/authors/id/:authorid", async (req, res) => {
  const getAuthor = await AuthorModel.findOne({
    id: parseInt(req.params.authorid),
  });
  if (!getAuthor)
    return res.json({ error: `No author with id ${req.params.authorid}` });
  return res.json({ author: getAuthor });
});

// Route    - /authors/books/:authorname
// Des      - To get a list of books based on authorname
// Access   - Public
// Method   - GET
// Params   - authorname
// Body     - none

Router.get("/authors/books/:authorname", async (req, res) => {
  const getAuthors = await AuthorModel.findOne({
    name: req.params.authorname,
  });
  if (!getAuthors)
    return res.json(`No book with authorname: ${req.params.authorname}`);
  let listBooks = [];
  getAuthors.books.forEach(async (each) => {
    const getBook = await BookModel.findOne({
      ISBN: each,
    });
    listBooks.push(getBook);
    len = getAuthors.books.length;
    if (each === getAuthors.books[len - 1]) return res.json(listBooks);
  });
});

// Route    - /authors/new
// Des      - adding new author
// Access   - Public
// Method   - Post
// Params   - none
// Body     - none

Router.post("/authors/new", async (req, res) => {
  const newAuthor = req.body;

  try {
    const newAuthor = req.body;
    await AuthorModel.create(newAuthor);
    return res.json({ message: "author added succesfully" });
  } catch (error) {
    return res.json({ message: error });
  }
});

// Route    - /authors/delete/books/:isbn/:id
// Des      - deleting a author from a book based on book isbn
// Access   - Public
// Method   - Delete
// Params   - isbn
// Body     - none

Router.delete("/authors/delete/books/:isbn/:id", async (req, res) => {
  const { isbn, id } = req.params;
  const getAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: parseInt(id),
    },
    {
      $pull: {
        books: isbn,
      },
    },
    {
      new: true,
    }
  );
  if (!getAuthor)
    return res.json(`There's no Author for book with ISBN: ${isbn}`);

  return res.json({
    updatedAuthor: getAuthor,
  });
});
// Route    - /authors/updateBook/:isbn
// Des      - to update/add new book
// Access   - Public
// Method   - POST
// Params   - isbn, id
// Body     - none

Router.post("/authors/updateBook/:isbn/:authorid", async (req, res) => {
  const { isbn, authorid } = req.params;
  const getUpdatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: parseInt(authorid),
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
  if (!getUpdatedAuthor)
    return res.json({
      error: `There is no author in database with ID: ${authorid}`,
    });
  const getUpdatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: isbn,
    },
    {
      $addToSet: {
        authors: parseInt(authorid),
      },
    },
    {
      new: true,
    }
  );
  res.json({ updatedAuthor: getUpdatedAuthor, updatedBook: getUpdatedBook });
});
// Route    - /authors/updateName/:authorid/:authorname
// Des      - to update author details
// Access   - Public
// Method   - PUT
// Params   - authorid, authorname
// Body     - none

Router.put("/authors/updateName/:authorid/:authorname", async (req, res) => {
  const getUpdatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: parseInt(req.params.authorid),
    },
    {
      name: req.params.authorname,
    },
    {
      new: true,
    }
  );

  return res.json(getUpdatedAuthor);
});
// Route    - /authors/delete/:isbn
// Des      - deleting a author based on ID
// Access   - Public
// Method   - Delete
// Params   - id
// Body     - none

Router.delete("/authors/delete/:id", async (req, res) => {
  const deletedAuthor = await AuthorModel.findOneAndDelete({
    id: parseInt(req.params.id),
  });
  if (!deletedAuthor)
    return res.json(`No such author with id: ${req.params.id}`);
  res.json(deletedAuthor);
});

module.exports = Router;
