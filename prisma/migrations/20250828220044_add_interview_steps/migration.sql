-- AlterTable
ALTER TABLE "InterviewProcess" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'In Progress';

-- CreateTable
CREATE TABLE "InterviewStep" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "interviewerName" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "interviewProcessId" TEXT NOT NULL,

    CONSTRAINT "InterviewStep_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InterviewStep" ADD CONSTRAINT "InterviewStep_interviewProcessId_fkey" FOREIGN KEY ("interviewProcessId") REFERENCES "InterviewProcess"("id") ON DELETE CASCADE ON UPDATE CASCADE;
