/**
 * Module dependencies.
 */
const {
  server,
  normalizePort,
  onError,
  onListening,
} = require("./src/bin/www");
const config = require("./src/config/index");

/**
 * Get environment and store in Express.
 */
const host = config.app.host;
const port = normalizePort(config.app.port);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, host);
server.on("error", onError);
server.on("listening", onListening);
