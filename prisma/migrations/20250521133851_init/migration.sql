-- CreateTable
CREATE TABLE "SoccerTeam" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "draws" INTEGER NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "SoccerMatch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matchCode" TEXT NOT NULL,
    "matchNumber" INTEGER NOT NULL,
    "round" INTEGER NOT NULL,
    "homeTeamId" TEXT,
    "awayTeamId" TEXT,
    "homeScore" INTEGER NOT NULL DEFAULT 0,
    "awayScore" INTEGER NOT NULL DEFAULT 0,
    "homeFirstHalf" INTEGER NOT NULL DEFAULT 0,
    "awayFirstHalf" INTEGER NOT NULL DEFAULT 0,
    "homeSecondHalf" INTEGER NOT NULL DEFAULT 0,
    "awaySecondHalf" INTEGER NOT NULL DEFAULT 0,
    "isPenaltyShootout" BOOLEAN NOT NULL DEFAULT false,
    "homePenaltyScore" INTEGER,
    "awayPenaltyScore" INTEGER,
    "winnerId" TEXT,
    "nextMatchId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "startTime" DATETIME,
    "endTime" DATETIME,
    "venue" TEXT,
    "referee" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SoccerMatch_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "SoccerTeam" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SoccerMatch_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "SoccerTeam" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SoccerMatch_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "SoccerTeam" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SoccerMatch_nextMatchId_fkey" FOREIGN KEY ("nextMatchId") REFERENCES "SoccerMatch" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SoccerMatchEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matchId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "playerName" TEXT NOT NULL,
    "minute" INTEGER NOT NULL,
    "eventType" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SoccerMatchEvent_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "SoccerMatch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "SoccerMatch_matchCode_key" ON "SoccerMatch"("matchCode");

-- CreateIndex
CREATE INDEX "SoccerMatch_matchCode_idx" ON "SoccerMatch"("matchCode");

-- CreateIndex
CREATE INDEX "SoccerMatchEvent_matchId_idx" ON "SoccerMatchEvent"("matchId");

-- CreateIndex
CREATE INDEX "SoccerMatchEvent_teamId_idx" ON "SoccerMatchEvent"("teamId");
