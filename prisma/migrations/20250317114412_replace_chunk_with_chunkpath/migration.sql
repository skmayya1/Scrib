/*
  Warnings:

  - You are about to drop the column `chunk` on the `temp_chunks` table. All the data in the column will be lost.
  - You are about to drop the column `trials` on the `user` table. All the data in the column will be lost.
  - Added the required column `chunkPath` to the `temp_chunks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Meetings" ALTER COLUMN "Audio" DROP NOT NULL;

-- AlterTable
ALTER TABLE "temp_chunks" DROP COLUMN "chunk",
ADD COLUMN     "chunkPath" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "trials";
