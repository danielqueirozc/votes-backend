/*
  Warnings:

  - The required column `id` was added to the `votes` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "votes_name_key";

-- AlterTable
ALTER TABLE "votes" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "votes_pkey" PRIMARY KEY ("id");
