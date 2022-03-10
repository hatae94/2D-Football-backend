const dotenv = require("dotenv");

dotenv.config();

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

module.exports = {
  port: normalizePort(process.env.PORT) || 7000,
  socketClientURL: process.env.CLIENT_SERVER,
};
