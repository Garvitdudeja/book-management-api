const BookModel = require("../schema/book");
const PublicationModel = require("../schema/publication");


const Router = require("express").Router();


// Route    - /publications
// Des      - To get all publications
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none

Router.get("/publications", async (req, res) => {
  getPublication = await PublicationModel.find();
  return res.json(getPublication);
});

// Route    - /publications/name/:pubName
// Des      - To get publication based upon name
// Access   - Public
// Method   - GET
// Params   - pubName
// Body     - none

Router.get("/publications/name/:pubName", async (req, res) => {
  const specificPublication = await PublicationModel.findOne({
    name: req.params.pubName,
  });

  if (!specificPublication)
    return res.json({
      message: `No such publication with name: ${req.params.pubName}`,
    });
  else return res.json(specificPublication);
});
// Route    - /publications/id/:pubId
// Des      - To get the author based upon id
// Access   - Public
// Method   - GET
// Params   - pubId
// Body     - none

Router.get("/publications/id/:pubId", async (req, res) => {
  const getAuthor = await PublicationModel.findOne({
    id: parseInt(req.params.pubId),
  });
  if (!getAuthor)
    return res.json({ error: `No publication with ID ${req.params.pubId}` });
  return res.json({ author: getAuthor });
});

// Route    - /publications/new
// Des      - adding new publications
// Access   - Public
// Method   - Post
// Params   - none
// Body     - none

Router.post("/publications/new", async (req, res) => {
  const newPublication = req.body;

  try {
    const newPublication = req.body;
    await PublicationModel.create(newPublication);
    return res.json({ message: "Publication added successfully" });
  } catch (error) {}
});

// Route    - /publications/delete/:id
// Des      - deleting a publication based on ID
// Access   - Public
// Method   - Delete
// Params   - id
// Body     - none

Router.delete("/publications/delete/:id", async (req, res) => {
  const deletedPublication = await PublicationModel.findOneAndDelete({
    id: parseInt(req.params.id),
  });
  if (!deletedPublication)
    return res.json({ error: `No publication with ID: ${req.params.id}` });
  else return res.json(deletedPublication);
});

// Route    - /publications/delete/books/:isbn/:id
// Des      - deleting a publication based on book isbn
// Access   - Public
// Method   - Delete
// Params   - isbn , newid
// Body     - none

Router.delete("/publications/delete/books/:isbn/:newid", async (req, res) => {
  const { isbn, newid } = req.params;
  const getPublication = await PublicationModel.findOneAndUpdate(
    {
      books: isbn,
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
  if (!getPublication)
    return res.json(
      `There's no Publication which prints book with ISBN: ${isbn}`
    );
  const getBook = await BookModel.findOneAndUpdate(
    {
      ISBN: isbn,
    },
    {
      publication: parseInt(newid),
    },
    {
      new: true,
    }
  );
  const getPublicationNew = await PublicationModel.findOneAndUpdate(
    {
      id: newid,
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

  return res.json({
    updatedBook: getBook,
    updatedPublication: getPublication,
    updatedPublication2: getPublicationNew,
  });
});



// Route    - /publications/updateBook/:PubId/:isbn
// Des      - to update/add new book
// Access   - Public
// Method   - PUT
// Params   - isbn, id
// Body     - none
Router.put("/publications/updateBook/:PubId/:isbn", async (req, res) => {
  const { isbn, PubId } = req.params;
  const getUpdatedPublication = await PublicationModel.findOneAndUpdate(
    {
      id: parseInt(PubId),
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
  if (!getUpdatedPublication)
    return res.json({
      error: `There is no author in database with ID: ${authorid}`,
    });
  const getUpdatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: isbn,
    },
    {
      publication: PubId,
    },
    {
      new: true,
    }
  );
  res.json({
    updatedPublication: getUpdatedPublication,
    updatedBook: getUpdatedBook,
  });
});

module.exports = Router;
