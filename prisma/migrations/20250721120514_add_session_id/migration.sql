/*
  Warnings:

  - A unique constraint covering the columns `[sessionId]` on the table `UserSession` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserSession" ADD COLUMN     "sessionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "UserSession_sessionId_key" ON "UserSession"("sessionId");

-- CreateIndex
CREATE INDEX "UserSession_sessionId_idx" ON "UserSession"("sessionId");
