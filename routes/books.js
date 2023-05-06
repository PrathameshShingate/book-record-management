const express = require("express");
const { books } = require("../data/books.json");
const { users } = require("../data/users.json");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: books,
  });
});

router.post("/", (req, res) => {
  let book = req.body;
  const book_present = books.find((item) => item.id === book.id);
  if (book_present) {
    res.status(404).json({
      success: false,
      message: "book already exists",
    });
  } else {
    books.push(book);
    res.status(201).json({
      success: true,
      message: "book added succesfully",
    });
  }
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const book = books.find((book) => book.id === id);
  if (!book) {
    res.status(404).json({
      success: false,
      message: "book not found",
    });
  } else {
    res.status(200).json({
      success: true,
      message: book,
    });
  }
});

router.put("/:id", (req, res) => {
  let { id } = req.params;
  const book_updated = books.find((item) => item.id === id);
  if (book_updated) {
    let body = req.body;
    console.log(body);
    for (let key in body) {
      for (let keys in book_updated) {
        if (key === keys) {
          book_updated[keys] = body[key];
        }
      }
    }
    res.status(200).json({
      success: true,
      message: "book updated succesfully",
    });
  } else {
    res.status(404).json({
      success: false,
      message: "book not found",
    });
  }
});

router.get("/issued/byuser", (req, res) => { 
    const users_with_book_issued = users.filter((user) => { 
        if (user.issuedBook) return user; 
    });
    // console.log(users_with_book_issued);
    let books_issued = [];

    users_with_book_issued.forEach((each_user) => {
        const books_found = books.find((each_book) => each_book.id === each_user.issuedBook);
        books_issued.push(books_found);
    });

    if (books_issued.length > 0) {
        res.status(200).json({
          success: true,
          data: books_issued,
        });
    } else {
        res.status(200).json({
            sucess: false,
            message: "no books issued"
        })
    }

});

module.exports = router;