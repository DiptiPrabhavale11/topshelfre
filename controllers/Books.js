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
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).send('Book not found');
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

bookRouter.post('/', (req, res) => {
});

bookRouter.put('/:id', (req, res) => {
});

bookRouter.delete('/:id', (req, res) => {
});

module.exports = bookRouter;