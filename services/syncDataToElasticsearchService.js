// Importing the Prisma client instance for database interactions
const prismaClient = require("../utils/prismaClient");
// Importing the SyncStatus enum from Prisma client for sync status reference
const { SyncStatus } = require("@prisma/client");

/**
 * Sync Data to ElasticSearch Service
 * 
 * Service responsible for handling operations related to syncing data to ElasticSearch,
 * including creation, updating status, and retrieving the last synced time.
 */
class syncDataToElasticSearchService {
    /**
   * Constructor for SyncDataToElasticSearchService.
   * Initializes the Prisma client instance.
   */
  constructor() {
    this._prismaClient = prismaClient;
  }

  /**
   * Create a new sync data entry with an initial status of INIT.
   * 
   * @returns {Promise} - A promise that resolves to the created sync data object.
   */
  async create() {
    return await this._prismaClient.syncDataToElasticSearch.create({
      data: {
        status: SyncStatus.INIT,
      },
    });
  }

  /**
   * Update the sync data entry with the specified ID, status, endTime, and optional metadata.
   * 
   * @param {number} id - The ID of the sync data entry to update.
   * @param {SyncStatus} status - The new status of the sync data entry.
   * @param {Date} endTime - The end time of the sync operation.
   * @param {Object|null} metadata - Optional metadata associated with the sync operation.
   */
  async update(id, status, endTime, metadata = null) {
    await this._prismaClient.syncDataToElasticSearch.update({
      where: {
        id: id,
      },
      data: {
        status: status,
        endedAt: endTime,
        metadata: metadata,
      },
    });
  }

  /**
   * Get the timestamp of the last successful sync operation.
   * 
   * @returns {Promise<Date|null>} - A promise that resolves to the timestamp of the last successful sync,
   * or null if no successful sync has been recorded.
   */
  async getLastSyncedTime() {
    const object = await this._prismaClient.syncDataToElasticSearch.findFirst({
      where: {
        status: SyncStatus.SUCCESS,
      },
      orderBy: { endedAt: "desc" },
    });

    return object?.endedAt;
  }
}

// Exporting the SyncDataToElasticSearchService class for use in other modules
module.exports = syncDataToElasticSearchService;
