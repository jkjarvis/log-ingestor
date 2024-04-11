// Importing the Winston library for logging functionality
const winston = require("winston");

/**
 * Logger Configuration
 *
 * Configures a logger using the Winston library with a single console transport.
 * This logger can be used for logging messages and errors in the application.
 */
const logger = winston.createLogger({
  // Configuring the logger with a single transport to the console
  transports: [new winston.transports.Console()],
});

// Exporting the configured logger for use in other modules
module.exports = logger;
