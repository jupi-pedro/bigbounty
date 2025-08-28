-- CreateTable
CREATE TABLE "InterviewProcess" (
    "id" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "identity" TEXT NOT NULL,
    "person" TEXT NOT NULL,
    "jobDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewProcess_pkey" PRIMARY KEY ("id")
);
