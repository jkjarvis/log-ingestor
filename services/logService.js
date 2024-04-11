// Importing the logger utility for logging purposes
const logger = require("../utils/logger");
// Importing LogLevel from Prisma client for log level enumeration
const { LogLevel } = require("@prisma/client");
// Importing the Prisma client instance for database interactions
const prismaClient = require("../utils/prismaClient");

/**
 * Log Service
 * 
 * Service responsible for handling log-related operations, including log creation and retrieval.
 */
class LogService {
  // Batch size for flushing logs to the database
  BATCH_SIZE = 10;
  // Array to temporarily store logs before flushing to the database
  logsArray = [];

  /**
   * Constructor for LogService.
   */
  constructor() {
    // Initializing the Prisma client instance
    this._prismaClient = prismaClient;
  }

  /**
   * Normalize log data to ensure consistent format.
   * 
   * @param {Object} data - The log data to be normalized.
   * @returns {Object} - The normalized log data.
   */
  normalizeLogData(data) {
    logger.info("normalizing log data...");
    // Extracting relevant fields from the input data
    return {
      level: data["level"],
      message: data["message"],
      resourceId: data["resourceId"],
      timestamp: data["timestamp"],
      traceId: data["traceId"],
      spanId: data["spanId"],
      commit: data["commit"],
      metadata: data["metadata"],
    };
  }

  /**
   * Create a log entry.
   * 
   * @param {Object} data - The log data to be created.
   */
  async createLog(data) {
    const normalizedLogData = this.normalizeLogData(data);

    logger.info(
      "Creating log data for data: " + JSON.stringify(normalizedLogData)
    );

    // Pushing the log entry to the logsArray
    this.logsArray.push({
      level: LogLevel[normalizedLogData["level"]],
      ...normalizedLogData,
    });

    // Triggering a flush if the logsArray reaches the batch size
    this.flush();
  }

  /**
   * Retrieve logs after a specified timestamp.
   * 
   * @param {Date} time - The timestamp after which logs are to be retrieved.
   * @returns {Promise<Array>} - A Promise resolving to an array of logs.
   */
  async getLogsAfterTime(time) {
    var result;

    // Checking if a timestamp is provided for filtering
    if(time){
      // Querying logs with a timestamp greater than the specified time
      result = await this._prismaClient.log.findMany({
        where: {
          createdAt: {
            gt: time,
          },
        },
      });
    }else{
      // Querying all logs if no timestamp is provided
      result = await this._prismaClient.log.findMany();
    }
console.log("result: "+result.length);
    return result;
  }

  /**
   * Flush logs to the database if the batch size is reached.
   */
  async flush() {
    if (this.logsArray.length >= this.BATCH_SIZE) {
      logger.info(`Creating ${this.BATCH_SIZE} Logs in db`);

      try {
        // Creating logs in the database using Prisma client
        await this._prismaClient.log.createMany({
          data: this.logsArray,
        });
      } catch (error) {
        logger.error("Error while creating Logs: " + error);
      }

      this.logsArray.length = 0;
    }
  }
}
// Exporting the LogService class for use in other modules
module.exports = LogService;
