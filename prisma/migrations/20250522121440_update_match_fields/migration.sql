/*
  Warnings:

  - You are about to drop the column `team1FirstHalf` on the `soccer_matches` table. All the data in the column will be lost.
  - You are about to drop the column `team1Id` on the `soccer_matches` table. All the data in the column will be lost.
  - You are about to drop the column `team1PenaltyScore` on the `soccer_matches` table. All the data in the column will be lost.
  - You are about to drop the column `team1SecondHalf` on the `soccer_matches` table. All the data in the column will be lost.
  - You are about to drop the column `team2FirstHalf` on the `soccer_matches` table. All the data in the column will be lost.
  - You are about to drop the column `team2Id` on the `soccer_matches` table. All the data in the column will be lost.
  - You are about to drop the column `team2PenaltyScore` on the `soccer_matches` table. All the data in the column will be lost.
  - You are about to drop the column `team2SecondHalf` on the `soccer_matches` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_soccer_matches" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matchCode" TEXT NOT NULL,
    "matchNumber" INTEGER NOT NULL,
    "round" INTEGER NOT NULL,
    "scheduledTime" DATETIME,
    "startTime" DATETIME,
    "endTime" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "homeTeamId" TEXT,
    "awayTeamId" TEXT,
    "homeFirstHalf" INTEGER NOT NULL DEFAULT 0,
    "awayFirstHalf" INTEGER NOT NULL DEFAULT 0,
    "homeSecondHalf" INTEGER NOT NULL DEFAULT 0,
    "awaySecondHalf" INTEGER NOT NULL DEFAULT 0,
    "isPenaltyShootout" BOOLEAN NOT NULL DEFAULT false,
    "homePenaltyScore" INTEGER,
    "awayPenaltyScore" INTEGER,
    "winnerId" TEXT,
    "nextMatchId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "soccer_matches_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "soccer_teams" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "soccer_matches_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "soccer_teams" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "soccer_matches_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "soccer_teams" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "soccer_matches_nextMatchId_fkey" FOREIGN KEY ("nextMatchId") REFERENCES "soccer_matches" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_soccer_matches" ("createdAt", "endTime", "id", "isPenaltyShootout", "matchCode", "matchNumber", "nextMatchId", "round", "scheduledTime", "startTime", "status", "updatedAt", "winnerId") SELECT "createdAt", "endTime", "id", "isPenaltyShootout", "matchCode", "matchNumber", "nextMatchId", "round", "scheduledTime", "startTime", "status", "updatedAt", "winnerId" FROM "soccer_matches";
DROP TABLE "soccer_matches";
ALTER TABLE "new_soccer_matches" RENAME TO "soccer_matches";
CREATE UNIQUE INDEX "soccer_matches_matchCode_key" ON "soccer_matches"("matchCode");
CREATE UNIQUE INDEX "soccer_matches_nextMatchId_key" ON "soccer_matches"("nextMatchId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
