/*
  Warnings:

  - You are about to drop the column `isCorrect` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `mediaUrl` on the `Question` table. All the data in the column will be lost.
  - Added the required column `correct` to the `Answer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "isCorrect",
ADD COLUMN     "correct" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "mediaUrl",
ADD COLUMN     "description" TEXT;
