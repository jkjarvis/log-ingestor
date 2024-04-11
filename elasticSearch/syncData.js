// Importing the Elasticsearch Client module
const elasticClient = require("./client");
// Importing the cron scheduler module
const cron = require("node-cron");
const logger = require("../utils/logger");
// Importing the SyncDataToElasticSearchService and LogService modules
const SyncDataToElasticSearchService = require("../services/syncDataToElasticsearchService");
const LogService = require("../services/logService");
// Importing the SyncStatus enum from the Prisma client
const { SyncStatus } = require("@prisma/client");

// Creating instances of the required services
const syncDataToElasticSearchService = new SyncDataToElasticSearchService();
const logService = new LogService();

/**
 * Syncs log data from the database to Elasticsearch.
 */
async function syncDataToElasticsearch() {
  // Creating a new sync data record
  const syncDataObject = await syncDataToElasticSearchService.create();
  // Retrieving the last synced time from the sync data records
  const timeToQuery = await syncDataToElasticSearchService.getLastSyncedTime();

  try {
    // Retrieving log data from the database after the last synced time
    const logData = await logService.getLogsAfterTime(timeToQuery);

    if (logData.length > 0) {
      // Indexing the log data in Elasticsearch using bulk indexing
      const bulkBody = logData.flatMap((doc) => [
        { index: { _index: "search-logs", _id: doc.id } },
        doc,
      ]);

      const res = await elasticClient.bulk({ body: bulkBody });
      logger.info("response from elasticSearch: " + JSON.stringify(res));
      logger.info("data synced successfully");
    } else {
      logger.info("No new or updated records to sync.");
    }

    // Updating the sync data record with success status and end time
    await syncDataToElasticSearchService.update(
      syncDataObject.id,
      SyncStatus.SUCCESS,
      new Date()
    );
  } catch (error) {
    // Handling errors during data syncing and updating the sync data record
    logger.error("Error syncing data to Elasticsearch:", error.message);
    await syncDataToElasticSearchService.update(
      syncDataObject.id,
      SyncStatus.ERROR,
      new Date(),
      error.stack
    );
  }
}

// Scheduling the sync job using cron syntax (e.g., run every minute)
cron.schedule("*/1 * * * *", async () => {
  logger.info("Running data sync to Elasticsearch job...");
  await syncDataToElasticsearch();
  logger.info("Data sync to Elasticsearch job completed.");
});
