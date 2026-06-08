/*
  Warnings:

  - You are about to drop the column `name` on the `Player` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Player_roomId_name_key";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "name";
