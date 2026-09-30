-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Division" AS ENUM ('GROUP', 'CONSTRUCTION', 'APARTMENTS', 'DESIGNS');

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "division" "Division" NOT NULL,
    "topic" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "message" TEXT NOT NULL,
    "lang" VARCHAR(2) NOT NULL,
    "page" TEXT,
    "country" VARCHAR(2),
    "region" TEXT,
    "city" TEXT,
    "emailed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- CreateIndex
CREATE INDEX "Lead_division_createdAt_idx" ON "Lead"("division", "createdAt");

