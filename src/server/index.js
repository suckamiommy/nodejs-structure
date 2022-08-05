/**
 * Module dependencies.
 */
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Logger = require("../utils/logger.js");
const logger = new Logger();
const app = express();
const pathFile = logger.getLabel(__filename);

/**
 * Middleware
 */
app.use(bodyParser.json());
app.use(cors());

process.on("SIGINT", () => {
  logger.log("stopping the server", "info");
  process.exit();
});

// app.use((req, res, next) => {
//   req.identifier = uuid();
//   const logString = `a request has been made with the following uuid [${
//     req.identifier
//   }] ${req.url} ${req.headers["user-agent"]} ${JSON.stringify(req.body)}`;
//   logger.log(logString, "info");
//   next();
// });

app.use((req, res, next) => {
  logger.log(
    `[${pathFile}] the url you are trying to reach is not hosted on our server`,
    "error"
  );
  const err = new Error("Not Found");
  err.status = 404;
  res.status(err.status).json({
    type: "error",
    message: "the url you are trying to reach is not hosted on our server",
  });
  next(err);
});

module.exports = app;
