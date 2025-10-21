/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `votes` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `votes` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `votes` table. All the data in the column will be lost.
  - Added the required column `participantId` to the `votes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "votes" DROP COLUMN "imageUrl",
DROP COLUMN "name",
DROP COLUMN "updatedAt",
ADD COLUMN     "participantId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Participants" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Participants_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
