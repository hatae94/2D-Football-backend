const express = require("express");
const morgan = require("morgan");

const expressLoader = require("./loaders/express");
const socketLoader = require("./loaders/socket");

const app = express();

app.use(morgan("dev"));

expressLoader({ app });

socketLoader({ app });

module.exports = app;
