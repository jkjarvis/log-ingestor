// Importing the Client class from the '@elastic/elasticsearch' library
const { Client } = require("@elastic/elasticsearch");

/**
 * Elasticsearch Client Configuration
 *
 * Creates a new instance of the Elasticsearch Client to interact with the Elasticsearch cluster.
 * The client is configured with the Elasticsearch cluster's node URL and API key for authentication.
 * The cluster's URL and API key are obtained from environment variables.
 */
const elasticSearchClient = new Client({
  node: "https://28efb54fc66c4c8689eb60c4cb4bbb3b.us-central1.gcp.cloud.es.io:443",
  auth: {
    apiKey: process.env.ELASTICSEARCH_API_KEY,
  },
});

// Exporting the configured Elasticsearch Client for use in other modules
module.exports = elasticSearchClient;
