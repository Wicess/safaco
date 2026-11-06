-- Admin panel accounts
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "lastLoginAt" TIMESTAMP(3),
    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- One row per browsing session
CREATE TABLE "Visit" (
    "id" VARCHAR(32) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "visitor" VARCHAR(32) NOT NULL,
    "returning" BOOLEAN NOT NULL DEFAULT false,
    "landing" TEXT NOT NULL,
    "pages" TEXT[],
    "views" INTEGER NOT NULL DEFAULT 1,
    "lang" VARCHAR(2),
    "referrer" TEXT,
    "device" VARCHAR(10),
    "country" VARCHAR(2),
    "region" TEXT,
    "city" TEXT,
    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Visit_createdAt_idx" ON "Visit"("createdAt");
CREATE INDEX "Visit_visitor_idx" ON "Visit"("visitor");
