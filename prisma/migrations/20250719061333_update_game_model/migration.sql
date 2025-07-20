/*
  Warnings:

  - A unique constraint covering the columns `[id,ownerId]` on the table `Game` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Game_id_ownerId_key" ON "Game"("id", "ownerId");
