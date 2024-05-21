const bookRouter = require("express").Router();
const Book = require("../models/Books");
const express = require("express");
const app = express();
app.use(express.json());

bookRouter.get("/", async (request, response) => {
    const books = await Book.find({});
    return response.json(books);
});

bookRouter.get('/:id', async (req, res) => {
    try {
        // Find the requested book from the database (mongoDB)
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).send('Book not found');
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

bookRouter.post('/', async (req, res) => {
    const { title, author, publish_date, price } = req.body;
    const newBook = new Book({
        title,
        author,
        publish_date,
        price,
    });
    try {
        // Save the new book to the database (mongoDB)
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (error) {
        res.status(400).send('Error: Something went wrong while saving the book: ' + error.message);
    }
});

bookRouter.put('/:id', async (req, res) => {
    const { title, author, publish_date, price } = req.body;

    try {
         // Update the existing book in the database (mongoDB)
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            { title, author, publish_date, price },
            { new: true, runValidators: true }
        );
        // Return error if book id is incorrect
        if (!updatedBook) {
            return res.status(404).send('Book not found');
        }

        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(400).send('Error: Something went wrong while updating the book: ' + error.message);
    }
});

bookRouter.delete('/:id', async (req, res) => {
    try {

        // Delete the existing book from the database (mongoDB)
        const deletedBook = await Book.findByIdAndDelete(req.params.id);

        // Return error if book id is incorrect
        if (!deletedBook) {
            return res.status(404).send('Book not found');
        }
        res.status(200).send(`Book id ${deletedBook._id} is deleted successfully`);
    } catch (error) {
        res.status(500).send('Error: Something went wrong while deleting the book:' + error.message);
    }
});

module.exports = bookRouter;