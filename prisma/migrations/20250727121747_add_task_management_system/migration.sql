/*
  Warnings:

  - The values [PHONE_CALL] on the enum `LeadSource` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "TaskManagementStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "TaskManagementPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "TaskRecurrenceType" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');

-- AlterEnum
BEGIN;
CREATE TYPE "LeadSource_new" AS ENUM ('WEBSITE', 'REFERRAL', 'SOCIAL_MEDIA', 'EMAIL_CAMPAIGN', 'COLD_CALL', 'TRADE_SHOW', 'PARTNER', 'OTHER');
ALTER TABLE "leads" ALTER COLUMN "source" DROP DEFAULT;
ALTER TABLE "leads" ALTER COLUMN "source" TYPE "LeadSource_new" USING ("source"::text::"LeadSource_new");
ALTER TYPE "LeadSource" RENAME TO "LeadSource_old";
ALTER TYPE "LeadSource_new" RENAME TO "LeadSource";
DROP TYPE "LeadSource_old";
ALTER TABLE "leads" ALTER COLUMN "source" SET DEFAULT 'OTHER';
COMMIT;

-- AlterTable
ALTER TABLE "leads" ADD COLUMN     "lastContactedAt" TIMESTAMP(3),
ADD COLUMN     "score" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "task_management" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskManagementStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "priority" "TaskManagementPriority" NOT NULL DEFAULT 'MEDIUM',
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "completionNote" TEXT,
    "createdById" TEXT NOT NULL,
    "assignedToId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_management_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_management_comments" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_management_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_management_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" "TaskManagementPriority" NOT NULL DEFAULT 'MEDIUM',
    "estimatedHours" INTEGER,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_management_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recurring_task_management" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "recurrenceType" "TaskRecurrenceType" NOT NULL,
    "recurrenceInterval" INTEGER NOT NULL DEFAULT 1,
    "nextDueDate" TIMESTAMP(3) NOT NULL,
    "assignedToId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recurring_task_management_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "task_management" ADD CONSTRAINT "task_management_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_management" ADD CONSTRAINT "task_management_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_management_comments" ADD CONSTRAINT "task_management_comments_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "task_management"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_management_comments" ADD CONSTRAINT "task_management_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_management_templates" ADD CONSTRAINT "task_management_templates_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurring_task_management" ADD CONSTRAINT "recurring_task_management_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "task_management_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurring_task_management" ADD CONSTRAINT "recurring_task_management_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurring_task_management" ADD CONSTRAINT "recurring_task_management_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
