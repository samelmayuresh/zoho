-- Task Management System Migration
-- This migration adds task management tables without affecting existing data

-- Create enums for task management
CREATE TYPE "TaskManagementStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD');
CREATE TYPE "TaskManagementPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE "TaskRecurrenceType" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');

-- Create task_management table
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

-- Create task_management_comments table
CREATE TABLE "task_management_comments" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_management_comments_pkey" PRIMARY KEY ("id")
);

-- Create task_management_templates table
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

-- Create recurring_task_management table
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

-- Add foreign key constraints
ALTER TABLE "task_management" ADD CONSTRAINT "task_management_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "task_management" ADD CONSTRAINT "task_management_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "task_management_comments" ADD CONSTRAINT "task_management_comments_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "task_management"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "task_management_comments" ADD CONSTRAINT "task_management_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "task_management_templates" ADD CONSTRAINT "task_management_templates_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "recurring_task_management" ADD CONSTRAINT "recurring_task_management_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "task_management_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "recurring_task_management" ADD CONSTRAINT "recurring_task_management_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "recurring_task_management" ADD CONSTRAINT "recurring_task_management_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create indexes for performance
CREATE INDEX "task_management_assignedToId_idx" ON "task_management"("assignedToId");
CREATE INDEX "task_management_createdById_idx" ON "task_management"("createdById");
CREATE INDEX "task_management_status_idx" ON "task_management"("status");
CREATE INDEX "task_management_dueDate_idx" ON "task_management"("dueDate");
CREATE INDEX "task_management_priority_idx" ON "task_management"("priority");
CREATE INDEX "task_management_assignedToId_status_idx" ON "task_management"("assignedToId", "status");

CREATE INDEX "task_management_comments_taskId_idx" ON "task_management_comments"("taskId");
CREATE INDEX "task_management_comments_userId_idx" ON "task_management_comments"("userId");

CREATE INDEX "task_management_templates_createdById_idx" ON "task_management_templates"("createdById");

CREATE INDEX "recurring_task_management_templateId_idx" ON "recurring_task_management"("templateId");
CREATE INDEX "recurring_task_management_assignedToId_idx" ON "recurring_task_management"("assignedToId");
CREATE INDEX "recurring_task_management_nextDueDate_idx" ON "recurring_task_management"("nextDueDate");
CREATE INDEX "recurring_task_management_isActive_idx" ON "recurring_task_management"("isActive");