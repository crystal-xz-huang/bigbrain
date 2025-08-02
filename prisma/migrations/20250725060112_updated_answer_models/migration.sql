/*
  Warnings:

  - You are about to drop the column `answerIds` on the `PlayerAnswer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PlayerAnswer" DROP COLUMN "answerIds";

-- CreateTable
CREATE TABLE "SelectedAnswer" (
    "id" TEXT NOT NULL,
    "playerAnswerId" TEXT NOT NULL,
    "questionAnswerId" TEXT NOT NULL,

    CONSTRAINT "SelectedAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SelectedAnswer_playerAnswerId_questionAnswerId_key" ON "SelectedAnswer"("playerAnswerId", "questionAnswerId");

-- AddForeignKey
ALTER TABLE "SelectedAnswer" ADD CONSTRAINT "SelectedAnswer_playerAnswerId_fkey" FOREIGN KEY ("playerAnswerId") REFERENCES "PlayerAnswer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectedAnswer" ADD CONSTRAINT "SelectedAnswer_questionAnswerId_fkey" FOREIGN KEY ("questionAnswerId") REFERENCES "QuestionAnswer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
