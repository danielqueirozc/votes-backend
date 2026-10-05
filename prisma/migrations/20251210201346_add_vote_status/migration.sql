-- CreateEnum
CREATE TYPE "VoteStatus" AS ENUM ('ACTIVE', 'CLOSED');

-- AlterTable
ALTER TABLE "votes" ADD COLUMN     "status" "VoteStatus" NOT NULL DEFAULT 'ACTIVE';
