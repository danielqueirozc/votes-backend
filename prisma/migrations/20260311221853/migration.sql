/*
  Warnings:

  - A unique constraint covering the columns `[winnerId]` on the table `votes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "votes" ADD COLUMN     "winnerId" TEXT;

-- CreateTable
CREATE TABLE "_VoteTied" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_VoteTied_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_VoteTied_B_index" ON "_VoteTied"("B");

-- CreateIndex
CREATE UNIQUE INDEX "votes_winnerId_key" ON "votes"("winnerId");

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "vote_participants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VoteTied" ADD CONSTRAINT "_VoteTied_A_fkey" FOREIGN KEY ("A") REFERENCES "votes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VoteTied" ADD CONSTRAINT "_VoteTied_B_fkey" FOREIGN KEY ("B") REFERENCES "vote_participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
