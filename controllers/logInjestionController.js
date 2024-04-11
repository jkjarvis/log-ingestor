// Importing the logger utility for logging purposes
const logger = require('../utils/logger');

// Importing services for handling raw logs and processed logs
const RawLogService = require("../services/rawLogsService");
const LogService = require("../services/logService");

/**
 * Log Ingestion Controller
 * 
 * Controller responsible for handling the ingestion of logs.
 */
class LogIngestionController{
    constructor(){
        // Initializing instances of RawLogService and LogService
        this.rawLogService = new RawLogService();
        this.logService = new LogService();
    }

    /**
     * Ingests logs by creating raw logs and processed logs.
     * 
     * @param {Object} data - The log data to be ingested.
     */
    async ingestLogs(data){
        logger.info("Ingesting logs...");
        logger.info("Request data: "+JSON.stringify(data));
        logger.info("Calling rawLogsService...");
    
        // Creating a raw log entry using the RawLogService
        this.rawLogService.createRawLog(data);
    
        logger.info("Calling logService...");
        // Creating a processed log entry using the LogService
        await this.logService.createLog(data);
    }
}

// Exporting the LogIngestionController class for use in other modules
module.exports = LogIngestionController;