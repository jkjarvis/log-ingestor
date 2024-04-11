// Importing the logger utility for logging purposes
const logger = require('../utils/logger');
// Importing the Prisma client instance for database interactions
const prismaClient = require( '../utils/prismaClient' );

/**
 * Raw Log Service
 * 
 * Service responsible for handling raw log-related operations, including raw log creation and flushing to the database.
 */
class RawLogService{
    // Batch size for flushing raw logs to the database
    BATCH_SIZE=10;

    // Array to temporarily store raw logs before flushing to the database
    rawLogsArray = [];

    /**
   * Constructor for RawLogService.
   */
    constructor(){
        // Initializing the Prisma client instance
        this._prismaClient = prismaClient;
    }

    /**
   * Create a raw log entry.
   * 
   * @param {Object} data - The raw log data to be created.
   */
    createRawLog(data){
        // Extracting resourceId from the raw log data
        const resourceId = data['resourceId'];

        if(!resourceId){
            logger.error("resourceId is null");
        }

        logger.info(`Creating Raw log with for resourceId: ${resourceId}, data: ${JSON.stringify(data)}`);

        // Pushing the raw log entry to the rawLogsArray
        this.rawLogsArray.push({
            data: data,
            resourceId: resourceId
        });
        
        // Triggering a flush if the rawLogsArray reaches the batch size
        this.flush();
    }

    /**
   * Flush raw logs to the database if the batch size is reached.
   */
    async flush(){
        // Checking if the rawLogsArray has reached the batch size
        if(this.rawLogsArray.length >= this.BATCH_SIZE){
            logger.info(`Creating ${this.BATCH_SIZE} Raw Logs in db`);

            try {
                // Creating raw logs in the database using Prisma client
                await this._prismaClient.rawLogs.createMany({
                    data: this.rawLogsArray
                });
            } catch (error) {
                logger.error("Error while creating Raw logs: "+error);
            }

            // Resetting the rawLogsArray after flushing
            this.rawLogsArray.length = 0;
        }
    }

}

// Exporting the RawLogService class for use in other modules
module.exports = RawLogService;