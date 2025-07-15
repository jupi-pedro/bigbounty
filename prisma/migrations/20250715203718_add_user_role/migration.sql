-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Administrator', 'Moderator', 'Viewer', 'Developer');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'Developer';
