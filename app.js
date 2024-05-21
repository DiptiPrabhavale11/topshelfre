// Connects the whole app
const configuration = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const middleware = require("./utils/middleware");
const mongoose = require("mongoose").set("strictQuery", true);
require("express-async-errors");
const logger = require("./utils/logger");
//Connecting with mongoDB based on configuration specified in .env file
mongoose.connect(configuration.MONGODB_URI)
    .then(() => {
        logger.info("Mongo Connection Success!");
    }).catch((error) => {
        logger.error("error connecting to MongoDB:", error.message);
    });

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
