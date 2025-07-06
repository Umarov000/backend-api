/*
  Warnings:

  - Added the required column `status` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "statuses" AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "status" "statuses" NOT NULL;
