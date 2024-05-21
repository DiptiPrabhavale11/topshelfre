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
    })

});


afterAll(async () => {
    await mongoose.connection.close();
});