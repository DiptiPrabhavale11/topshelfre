require("dotenv").config();

const PORT = process.env.PORT;

let MONGODB_URI;

if (process.env.NODE_ENV === "prod") {
    MONGODB_URI = process.env.PROD_MONGODB_URI;
} else if (process.env.NODE_ENV === "test") {
    MONGODB_URI = process.env.TEST_MONGODB_URI;
} else {
    MONGODB_URI = process.env.DEV_MONGODB_URI;
}
module.exports = {
    MONGODB_URI,
    PORT
};