-- CreateEnum
CREATE TYPE "RateLimitAlgorithm" AS ENUM ('TOKEN_BUCKET', 'FIXED_WINDOW', 'SLIDING_WINDOW', 'LEAKY_BUCKET');

-- CreateTable
CREATE TABLE "Policy" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "algorithm" "RateLimitAlgorithm" NOT NULL DEFAULT 'TOKEN_BUCKET',
    "capacity" INTEGER NOT NULL,
    "refillRate" INTEGER NOT NULL,
    "interval" INTEGER NOT NULL,
    "apiKeyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Policy_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Policy" ADD CONSTRAINT "Policy_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "api_keys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
