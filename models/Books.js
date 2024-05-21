const mongoose = require("mongoose").set("strictQuery", true);
// Represents the book schema
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    publish_date: Date,
    price: Number,
});

//Convert _id (default key for mongoDB) to bookId
bookSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.bookId = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model("Book", bookSchema);