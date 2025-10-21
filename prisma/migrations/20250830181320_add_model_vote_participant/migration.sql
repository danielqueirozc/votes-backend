/*
  Warnings:

  - You are about to drop the `_ParticipantToVote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ParticipantToVote" DROP CONSTRAINT "_ParticipantToVote_A_fkey";

-- DropForeignKey
ALTER TABLE "_ParticipantToVote" DROP CONSTRAINT "_ParticipantToVote_B_fkey";

-- DropTable
DROP TABLE "_ParticipantToVote";

-- CreateTable
CREATE TABLE "vote_participants" (
    "id" TEXT NOT NULL,
    "voteId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,

    CONSTRAINT "vote_participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vote_participants_voteId_participantId_key" ON "vote_participants"("voteId", "participantId");

-- AddForeignKey
ALTER TABLE "vote_participants" ADD CONSTRAINT "vote_participants_voteId_fkey" FOREIGN KEY ("voteId") REFERENCES "votes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote_participants" ADD CONSTRAINT "vote_participants_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
