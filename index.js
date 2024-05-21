//Starting point of application
const app = require("./app");
const http = require("http");
const config = require("./Utils/config");
const logger = require("./Utils/logger");

const server = http.createServer(app);

server.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
});