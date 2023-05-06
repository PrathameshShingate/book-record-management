const express = require("express");
const usersRouter = require("./routes/users");
const booksRouter = require("./routes/books");

const app = express();

const port = 8081;

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "home page"
    });
});

app.use("/users", usersRouter);

app.use("/books", booksRouter);

app.all("*", (req, res) => {
    res.status(404).json({
        message: "page not found"
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
