// Importing the PrismaClient class from the '@prisma/client' library
const { PrismaClient } = require("@prisma/client");

/**
 * Prisma Client Configuration
 *
 * Creates a new instance of the PrismaClient, which is used to interact with the database.
 * PrismaClient is auto-generated based on the Prisma schema and provides a query builder
 * for performing database operations.
 */
const prismaClient = new PrismaClient();

// Exporting the configured PrismaClient instance for use in other modules
module.exports = prismaClient;
