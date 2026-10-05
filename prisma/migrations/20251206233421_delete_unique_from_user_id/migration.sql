-- DropIndex
DROP INDEX "user_votes_userId_voteId_key";

-- AlterTable
ALTER TABLE "user_votes" ADD COLUMN     "anonymousId" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "user_votes_voteId_anonymousId_idx" ON "user_votes"("voteId", "anonymousId");

-- CreateIndex
CREATE INDEX "user_votes_voteId_userId_idx" ON "user_votes"("voteId", "userId");
