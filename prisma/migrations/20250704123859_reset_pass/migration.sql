/*
  Warnings:

  - You are about to drop the column `token` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "token",
ADD COLUMN     "password_token" TEXT,
ADD COLUMN     "refresh_token" TEXT;
