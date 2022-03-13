const cookieParser = require("cookie-parser");
const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const history = require("connect-history-api-fallback");

module.exports = ({ app }) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(cors({ origin: process.env.CLIENT_SERVER }));
  app.use(history());

  app.use((req, res, next) => {
    next(createError(404));
  });

  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ result: "error", errMessage: err.errMessage });
  });
};
