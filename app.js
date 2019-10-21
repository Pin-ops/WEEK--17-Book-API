const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");


const app = express();

app.set = ('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/bookDB", { useNewUrlParser: true });

const bookSchema = {
    bookName: String,
    summary: String
};

const Book = mongoose.model("Book", bookSchema);


/////////////////////////////GET ALL THE BOOKS////////////////////////////
app.route("/books")

.get(function(req, res) {
    Book.find(function(err, summarisedBooks) {
        if (!err) {
            res.send(summarisedBooks);
        } else {
            res.send(err);
        }
    });
})

.post(function(req, res) {

    const newBook = new Book({
        bookName: req.body.bookName,
        summary: req.body.summary
    });

    newBook.save(function(err) {
        if (!err) {
            res.send("Successfully added a new book summary.");
        } else {
            res.send(err);
        }
    });
})

.delete(function(req, res) {
    Book.deleteMany(function(err) {
        if (!err) {
            res.send("Successfully deleted all book summaries.");
        } else {
            res.send(err);
        }
    });
});

/////////////////////////////GET A SPECIFIC BOOK////////////////////////////

app.route("/books/:bookTitle")

.get(function(req, res) {

    Book.findOne({ bookName: req.params.bookTitle }, function(err, foundBook) {
        if (foundBook) {
            res.send(foundBook);
        } else {
            res.send("No books matching that title was found.");
        }
    });
})

.put(function(req, res) {
    Book.update({ bookName: req.params.bookTitle }, { bookName: req.body.bookName, summary: req.body.summary }, { overwrite: true },
        function(err) {
            if (!err) {
                res.send("Successfully updated the selected book.");
            } else {
                res.send(err);
            }
        }
    )
})

.patch(function(req, res) {
    Book.update({ bookName: req.params.bookTitle }, { $set: req.body },
        function(err) {
            if (!err) {
                res.send("Successfully updated book.");
            } else {
                res.send(err);
            }
        }
    );
})

.delete(function(req, res) {
    Book.deleteOne({ bookName: req.params.bookTitle },
        function(err) {
            if (!err) {
                res.send("Successfully deleted the selected book.");
            } else {
                res.send(err);
            }
        });
});


app.listen(3000, function() {
    console.log("Server started on port 3000");
});