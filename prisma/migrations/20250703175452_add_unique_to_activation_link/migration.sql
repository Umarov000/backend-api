/*
  Warnings:

  - A unique constraint covering the columns `[activation_link]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_activation_link_key" ON "User"("activation_link");
