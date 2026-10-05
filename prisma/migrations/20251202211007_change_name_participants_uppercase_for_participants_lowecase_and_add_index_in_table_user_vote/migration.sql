/*
  Warnings:

  - You are about to drop the `Participants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserVote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserVote" DROP CONSTRAINT "UserVote_participantId_fkey";

-- DropForeignKey
ALTER TABLE "UserVote" DROP CONSTRAINT "UserVote_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserVote" DROP CONSTRAINT "UserVote_voteId_fkey";

-- DropForeignKey
ALTER TABLE "vote_participants" DROP CONSTRAINT "vote_participants_participantId_fkey";

-- DropTable
DROP TABLE "Participants";

-- DropTable
DROP TABLE "UserVote";

-- CreateTable
CREATE TABLE "participants" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_votes" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "voteId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,

    CONSTRAINT "user_votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_votes_voteId_participantId_idx" ON "user_votes"("voteId", "participantId");

-- CreateIndex
CREATE UNIQUE INDEX "user_votes_userId_voteId_key" ON "user_votes"("userId", "voteId");

-- AddForeignKey
ALTER TABLE "vote_participants" ADD CONSTRAINT "vote_participants_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_votes" ADD CONSTRAINT "user_votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_votes" ADD CONSTRAINT "user_votes_voteId_fkey" FOREIGN KEY ("voteId") REFERENCES "votes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_votes" ADD CONSTRAINT "user_votes_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
