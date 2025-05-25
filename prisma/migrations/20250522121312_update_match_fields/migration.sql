/*
  Warnings:

  - You are about to drop the `SoccerMatch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SoccerMatchEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SoccerTeam` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SoccerMatch";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SoccerMatchEvent";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SoccerTeam";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "soccer_teams" (
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
CREATE TABLE "soccer_matches" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matchCode" TEXT NOT NULL,
    "matchNumber" INTEGER NOT NULL,
    "round" INTEGER NOT NULL,
    "scheduledTime" DATETIME,
    "startTime" DATETIME,
    "endTime" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "team1Id" TEXT,
    "team2Id" TEXT,
    "team1FirstHalf" INTEGER NOT NULL DEFAULT 0,
    "team2FirstHalf" INTEGER NOT NULL DEFAULT 0,
    "team1SecondHalf" INTEGER NOT NULL DEFAULT 0,
    "team2SecondHalf" INTEGER NOT NULL DEFAULT 0,
    "isPenaltyShootout" BOOLEAN NOT NULL DEFAULT false,
    "team1PenaltyScore" INTEGER,
    "team2PenaltyScore" INTEGER,
    "winnerId" TEXT,
    "nextMatchId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "soccer_matches_team1Id_fkey" FOREIGN KEY ("team1Id") REFERENCES "soccer_teams" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "soccer_matches_team2Id_fkey" FOREIGN KEY ("team2Id") REFERENCES "soccer_teams" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "soccer_matches_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "soccer_teams" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "soccer_matches_nextMatchId_fkey" FOREIGN KEY ("nextMatchId") REFERENCES "soccer_matches" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "soccer_matches_matchCode_key" ON "soccer_matches"("matchCode");

-- CreateIndex
CREATE UNIQUE INDEX "soccer_matches_nextMatchId_key" ON "soccer_matches"("nextMatchId");
