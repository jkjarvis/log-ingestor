// Importing the Elasticsearch Client module
const elasticClient = require("./client");
// Importing the logger utility module
const logger = require("../utils/logger");

// Default fields used for full-text search if not specified by the user
DEFAULT_FIELDS = [
  "level",
  "message",
  "traceId",
  "spanId",
  "commit",
  "resourceId",
  "metadata.parentResourceId",
];

/**
 * Parses the Elasticsearch response data to extract relevant log information.
 * @param {Object} responseData - Elasticsearch response data.
 * @returns {Array} An array of log objects.
 */
function parseResponse(responseData){
    return responseData.hits.hits.map(hit => ({
        id: hit._id,
        level: hit._source.level,
        message: hit._source.message,
        timestamp: hit._source.timestamp,
        traceId: hit._source.traceId,
        spanId: hit._source.spanId,
        commit: hit._source.commit,
        resourceId: hit._source.resourceId,
        parentResourceId: hit._source.metadata.parentResourceId,
        createdAt: hit._source.createdAt,
        updatedAt: hit._source.updatedAt,
      }));
}

/**
 * Performs a full-text search in Elasticsearch.
 * @param {string} queryText - The text to search for.
 * @param {Array} fields - The fields to search in (default is DEFAULT_FIELDS).
 * @returns {Array} An array of log objects matching the search criteria.
 */
async function fullTextSearch(queryText, fields = DEFAULT_FIELDS) {
  try {
    logger.info(`Searching for queryText: ${queryText} in fullTextSearch with fields: ${JSON.stringify(fields)}`);
    const response = await elasticClient.search({
      index: "search-logs",
      body: {
        query: {
          multi_match: {
            query: queryText,
            fields: fields,
          },
        },
      },
    });

    logger.info(parseResponse(response));

    return parseResponse(response);
  } catch (error) {
    logger.error("Error doing fullTextSearch: " + error.stack);
  }
}

/**
 * Performs a date-based search in Elasticsearch.
 * @param {Date} startDate - The start date for the search.
 * @param {Date} endDate - The end date for the search (default is current date).
 * @returns {Array} An array of log objects matching the date range.
 */
async function searchByDate(startDate, endDate = new Date()) {
  try {
    logger.info(
      `Searching for logs ranging in start: ${startDate}, end: ${endDate} in searchByDate`
    );
    const response = await elasticClient.search({
      index: "search-logs",
      body: {
        query: {
          range: {
            timestamp: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      },
    });

    logger.info("Received response: " + JSON.stringify(response));
    logger.info("Total hits:", response.hits.total.value);
    logger.info("Search results:", response.hits.hits);

    return parseResponse(response);
  } catch (error) {
    logger.error("Error doing searchByDate: " + error.stack);
  }
}

// Exporting the functions for use in other modules
module.exports = {fullTextSearch, searchByDate};