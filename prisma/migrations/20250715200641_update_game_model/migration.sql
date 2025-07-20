/*
  Warnings:

  - You are about to drop the column `title` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Question` table. All the data in the column will be lost.
  - Added the required column `name` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "title",
DROP COLUMN "updatedAt",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "text",
ADD COLUMN     "name" TEXT NOT NULL;
