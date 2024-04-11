// Importing functions for executing Elasticsearch queries
const { fullTextSearch, searchByDate } = require( '../elasticSearch/queryData' );
// Importing the logger utility for logging purposes
const logger = require('../utils/logger');

/**
 * Query Interface Controller
 * 
 * Controller responsible for handling queries to retrieve data from Elasticsearch.
 */
class QueryInterfaceController{
    /**
     * Executes a query based on the specified query type.
     * 
     * @param {Object} data - The query data containing queryType and relevant parameters.
     * @returns {Promise<Array>} - A Promise resolving to the result of the query.
     */
    async queryData(data){
        // Extracting the query type from the data
        const queryType = data['queryType'];
        logger.info(`Querying data for queryType: ${queryType}`)

        if(queryType === "fullTextSearch"){
            // Handling different query types
            const queryText = data['queryText'];
            const queryFields = data['queryFields'];

            // Executing full text search query
            return await fullTextSearch(queryText, queryFields);
        }else if(queryType === "timestampSearch"){
            // Extracting start and end dates for timestamp-based search
            const startDate = data['startDate'];
            const endDate = data['endDate'];

            // Executing timestamp-based search query
            return await searchByDate(startDate, endDate);
        }
    }
}

// Exporting the QueryInterfaceController class for use in other modules
module.exports = QueryInterfaceController;