/*
  Warnings:

  - Added the required column `jobLinkSourceId` to the `JobLink` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobLink" ADD COLUMN     "jobLinkSourceId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "JobLinkSource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobLinkSource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobLinkSource_name_key" ON "JobLinkSource"("name");

-- AddForeignKey
ALTER TABLE "JobLink" ADD CONSTRAINT "JobLink_jobLinkSourceId_fkey" FOREIGN KEY ("jobLinkSourceId") REFERENCES "JobLinkSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
