/*
  Warnings:

  - A unique constraint covering the columns `[winnerName]` on the table `votes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "votes" ADD COLUMN     "winnerName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "votes_winnerName_key" ON "votes"("winnerName");
