-- CreateTable
CREATE TABLE "AnonymousUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "anonymousId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "timezone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "OutfitUpload" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "storagePath" TEXT NOT NULL,
    "publicUrl" TEXT,
    "styleNotes" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OutfitUpload_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AnonymousUser" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DrawSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "mood" TEXT NOT NULL,
    "context" TEXT,
    "uploadId" TEXT,
    "drawSeed" TEXT NOT NULL,
    "cardOptions" JSONB NOT NULL,
    "selectedIndex" INTEGER,
    "selectedAt" DATETIME,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DrawSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AnonymousUser" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DrawSession_uploadId_fkey" FOREIGN KEY ("uploadId") REFERENCES "OutfitUpload" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GenerationJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "drawSessionId" TEXT NOT NULL,
    "drawPosition" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "fallbackUsed" BOOLEAN NOT NULL DEFAULT false,
    "errorCode" TEXT,
    "resultCardId" TEXT,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    CONSTRAINT "GenerationJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AnonymousUser" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GenerationJob_drawSessionId_fkey" FOREIGN KEY ("drawSessionId") REFERENCES "DrawSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuraCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "generationJobId" TEXT NOT NULL,
    "uploadId" TEXT,
    "mood" TEXT NOT NULL,
    "context" TEXT,
    "drawSeed" TEXT NOT NULL,
    "drawPosition" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "shareImageUrl" TEXT,
    "isActivated" BOOLEAN NOT NULL DEFAULT false,
    "activatedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AuraCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AnonymousUser" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AuraCard_generationJobId_fkey" FOREIGN KEY ("generationJobId") REFERENCES "GenerationJob" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AuraCard_uploadId_fkey" FOREIGN KEY ("uploadId") REFERENCES "OutfitUpload" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuraActivation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "anchorType" TEXT NOT NULL,
    "anchorLabel" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "holdDurationMs" INTEGER,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sealedAt" DATETIME,
    CONSTRAINT "AuraActivation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AnonymousUser" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AuraActivation_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "AuraCard" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SavedCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SavedCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AnonymousUser" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SavedCard_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "AuraCard" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ShareEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ShareEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AnonymousUser" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ShareEvent_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "AuraCard" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "eventName" TEXT NOT NULL,
    "page" TEXT,
    "platform" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AnalyticsEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AnonymousUser" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CardTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "AnonymousUser_anonymousId_key" ON "AnonymousUser"("anonymousId");

-- CreateIndex
CREATE UNIQUE INDEX "OutfitUpload_storagePath_key" ON "OutfitUpload"("storagePath");

-- CreateIndex
CREATE INDEX "OutfitUpload_userId_createdAt_idx" ON "OutfitUpload"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "DrawSession_userId_createdAt_idx" ON "DrawSession"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "DrawSession_uploadId_idx" ON "DrawSession"("uploadId");

-- CreateIndex
CREATE UNIQUE INDEX "DrawSession_userId_drawSeed_key" ON "DrawSession"("userId", "drawSeed");

-- CreateIndex
CREATE INDEX "GenerationJob_userId_startedAt_idx" ON "GenerationJob"("userId", "startedAt");

-- CreateIndex
CREATE INDEX "GenerationJob_status_startedAt_idx" ON "GenerationJob"("status", "startedAt");

-- CreateIndex
CREATE UNIQUE INDEX "GenerationJob_drawSessionId_drawPosition_key" ON "GenerationJob"("drawSessionId", "drawPosition");

-- CreateIndex
CREATE UNIQUE INDEX "AuraCard_generationJobId_key" ON "AuraCard"("generationJobId");

-- CreateIndex
CREATE INDEX "AuraCard_userId_createdAt_idx" ON "AuraCard"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AuraCard_isActivated_activatedAt_idx" ON "AuraCard"("isActivated", "activatedAt");

-- CreateIndex
CREATE INDEX "AuraCard_uploadId_idx" ON "AuraCard"("uploadId");

-- CreateIndex
CREATE INDEX "AuraActivation_cardId_status_idx" ON "AuraActivation"("cardId", "status");

-- CreateIndex
CREATE INDEX "AuraActivation_userId_startedAt_idx" ON "AuraActivation"("userId", "startedAt");

-- CreateIndex
CREATE UNIQUE INDEX "AuraActivation_cardId_userId_anchorType_anchorLabel_key" ON "AuraActivation"("cardId", "userId", "anchorType", "anchorLabel");

-- CreateIndex
CREATE INDEX "SavedCard_cardId_createdAt_idx" ON "SavedCard"("cardId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SavedCard_userId_cardId_key" ON "SavedCard"("userId", "cardId");

-- CreateIndex
CREATE INDEX "ShareEvent_cardId_createdAt_idx" ON "ShareEvent"("cardId", "createdAt");

-- CreateIndex
CREATE INDEX "ShareEvent_userId_createdAt_idx" ON "ShareEvent"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ShareEvent_channel_createdAt_idx" ON "ShareEvent"("channel", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_eventName_createdAt_idx" ON "AnalyticsEvent"("eventName", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_userId_createdAt_idx" ON "AnalyticsEvent"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "CardTemplate_format_isActive_idx" ON "CardTemplate"("format", "isActive");
