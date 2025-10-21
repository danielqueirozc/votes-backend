/*
  Warnings:

  - You are about to drop the column `participantId` on the `votes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "votes" DROP CONSTRAINT "votes_participantId_fkey";

-- AlterTable
ALTER TABLE "votes" DROP COLUMN "participantId";

-- CreateTable
CREATE TABLE "_ParticipantToVote" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ParticipantToVote_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ParticipantToVote_B_index" ON "_ParticipantToVote"("B");

-- AddForeignKey
ALTER TABLE "_ParticipantToVote" ADD CONSTRAINT "_ParticipantToVote_A_fkey" FOREIGN KEY ("A") REFERENCES "Participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantToVote" ADD CONSTRAINT "_ParticipantToVote_B_fkey" FOREIGN KEY ("B") REFERENCES "votes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
