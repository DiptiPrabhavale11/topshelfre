const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app.js");
const Book = require("../../models/Books.js");
const api = supertest(app);
const { BookList } = require("../mock_data/BooksData.js");

const addBook = async (bookList) => {
    let books = [];
    bookList.forEach(book => {
        let bookObj = new Book(book);
        books.push(bookObj);
    });
    await Book.insertMany(books);
};

beforeEach(async () => {
    await Book.deleteMany({});
    addBook(BookList);
});

describe('Test the book store API', () => {
    describe('Test GET book API', () => {
        test('Test GET /books should return 200 status code on success and return JSON with expected length', async () => {
            const response = await api.get('/books')
                .expect(200)
                .expect("Content-Type", /application\/json/);
            expect(response.body).toHaveLength(BookList.length);
        });

        test('Test GET /books/:id should return 200 status code on success and return JSON with expected details', async () => {
            const getAllResponse = await api.get("/books");
            const id = getAllResponse.body[0].bookId;
            expect(getAllResponse.body).toHaveLength(BookList.length);
            const getBookResponse = await api.get(`/books/${id}`)
                .expect(200)
                .expect("Content-Type", /application\/json/);
            expect(getBookResponse.body).toHaveProperty('title', getAllResponse.body[0].title);
            expect(getBookResponse.body).toHaveProperty('author', getAllResponse.body[0].author);
            expect(getBookResponse.body).toHaveProperty('publish_date', getAllResponse.body[0].publish_date);
            expect(getBookResponse.body).toHaveProperty('price', getAllResponse.body[0].price);
        });

        test('Test GET /books/:id with invalid ID should return Book not found', async () => {
            const response = await api.get('/books/664c0ac2c2a4974dd9b7296c')
                .expect(404)
            expect(response.text).toBe('Book not found');
        });

        test('Test GET /books/:id with invalid input should return Server Error', async () => {
            const response = await api.get('/books/XXXXX')
                .expect(500)
            expect(response.text).toBe('Server error');
        });
    })

    describe('Test POST book API', () => {
        test('Test POST /books should return 201 status code on success and return JSON for the new book', async () => {
            const newBook = {
                "title": "Five Point Someone",
                "author": "Chetan Bhagat",
                "publish_date": "2009-10-08T00:00:00.000Z",
                "price": 5.99,
            };
            const response = await api
                .post('/books')
                .send(newBook)
                .expect(201);

            // Ensure the response body contains the new book with an ID
            expect(response.body).toMatchObject(newBook);
            expect(response.body).toHaveProperty('bookId');
        })

        test('Test POST /books should return 400 status code for invalid input', async () => {
            const invalidBook = {
                "title": "",
                "author": "Chetan Bhagat",
                "publish_date": "invalid-date-format",
                "price": -5.99,
            };

            const response = await api
                .post('/books')
                .send(invalidBook)
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toContain('Invalid Input data');
        });

        test('Test POST /books should return 400 status code for missing required fields', async () => {
            const incompleteBook = {
                author: "Chetan Bhagat",
                publish_date: "2009-10-08T00:00:00.000Z",
                price: 5.99
            };

            const response = await api
                .post('/books')
                .send(incompleteBook)
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toContain('Invalid Input data');
        });

        test('Test POST /books should return 400 status code for invalid date format', async () => {
            const invalidDateBook = {
                title: "Invalid Date Book",
                author: "Test Author",
                publish_date: "invalid-date-format",
                price: 5.99
            };
            const response = await api
                .post('/books')
                .send(invalidDateBook)
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toContain('Invalid Input data');
        });

        test('Test POST /books should return 400 status code for invalid price', async () => {
            const negativePriceBook = {
                title: "Negative Price Book",
                author: "Test Author",
                publish_date: "2023-01-01T00:00:00.000Z",
                price: "xxx"
            };

            const response = await api
                .post('/books')
                .send(negativePriceBook)
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toContain('Invalid Input data');
        });

    });

    describe('Test PUT book API', () => {
        test('Test PUT /books/:id should return 200 status code on success and return updated book details', async () => {
            const getAllResponse = await api.get("/books");
            const id = getAllResponse.body[0].bookId;
            const updatedBook = {
                title: "Updated Book Title",
                author: "Updated Book Author",
                publish_date: "2023-02-01T00:00:00.000Z",
                price: 19.99
            };

            const response = await api
                .put(`/books/${id}`)
                .send(updatedBook)
                .expect(200);

            expect(response.body).toMatchObject(updatedBook);
        });

        test('Test PUT /books should return 404 status code if book ID does not exist', async () => {
            const response = await api
                .put(`/books/664bfc31d58937c26d17a9b0`)
                .send({
                    title: "Updated Book Title",
                    author: "Updated Book Author",
                    publish_date: "2023-02-01T00:00:00.000Z",
                    price: 19.99,
                    pages: 250,
                    ratings: 4.5,
                    category: "Updated Category"
                })
                .expect(404);

            expect(response.text).toBe('Book not found');
        });
    });

    describe('Test DELETE book API', () => {
        test('Test DELETE /books/:id should return 200 status code on success and return updated book details', async () => {
            const getAllResponse = await api.get("/books");
            const id = getAllResponse.body[0].bookId;
            const response = await api
                .delete(`/books/${id}`)
                .expect(200)
                expect(response.text).toBe(`Book id ${id} is deleted successfully`);
        });
        test('Test DELETE /books/:id should return 404 status code if book ID does not exist', async () => {
            const response = await api
                .delete(`/books/664bfc31d58937c26d17a9b0`)
                .expect(404);

            expect(response.text).toBe('Book not found');
        });
    });

});


afterAll(async () => {
    await mongoose.connection.close();
});