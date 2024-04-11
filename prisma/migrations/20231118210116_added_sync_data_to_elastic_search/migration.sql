-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('SUCCESS', 'ERROR', 'INIT');

-- CreateTable
CREATE TABLE "SyncDataToElasticSearch" (
    "id" SERIAL NOT NULL,
    "status" "SyncStatus" NOT NULL,
    "metadata" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "SyncDataToElasticSearch_pkey" PRIMARY KEY ("id")
);
