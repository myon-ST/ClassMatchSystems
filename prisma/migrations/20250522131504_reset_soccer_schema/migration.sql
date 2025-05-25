/*
  Warnings:

  - You are about to drop the `soccer_teams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `awayTeamId` on the `soccer_matches` table. All the data in the column will be lost.
  - You are about to drop the column `homeTeamId` on the `soccer_matches` table. All the data in the column will be lost.
  - You are about to drop the column `winnerId` on the `soccer_matches` table. All the data in the column will be lost.
  - Added the required column `awayTeam` to the `soccer_matches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `homeTeam` to the `soccer_matches` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "soccer_teams";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_soccer_matches" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matchCode" TEXT NOT NULL,
    "round" INTEGER NOT NULL,
    "matchNumber" INTEGER NOT NULL,
    "scheduledTime" DATETIME,
    "startTime" DATETIME,
    "endTime" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "homeTeam" TEXT NOT NULL,
    "awayTeam" TEXT NOT NULL,
    "homeFirstHalf" INTEGER NOT NULL DEFAULT 0,
    "awayFirstHalf" INTEGER NOT NULL DEFAULT 0,
    "homeSecondHalf" INTEGER NOT NULL DEFAULT 0,
    "awaySecondHalf" INTEGER NOT NULL DEFAULT 0,
    "isPenaltyShootout" BOOLEAN NOT NULL DEFAULT false,
    "homePenaltyScore" INTEGER,
    "awayPenaltyScore" INTEGER,
    "winner" TEXT,
    "nextMatchId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "soccer_matches_nextMatchId_fkey" FOREIGN KEY ("nextMatchId") REFERENCES "soccer_matches" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_soccer_matches" ("awayFirstHalf", "awayPenaltyScore", "awaySecondHalf", "createdAt", "endTime", "homeFirstHalf", "homePenaltyScore", "homeSecondHalf", "id", "isPenaltyShootout", "matchCode", "matchNumber", "nextMatchId", "round", "scheduledTime", "startTime", "status", "updatedAt") SELECT "awayFirstHalf", "awayPenaltyScore", "awaySecondHalf", "createdAt", "endTime", "homeFirstHalf", "homePenaltyScore", "homeSecondHalf", "id", "isPenaltyShootout", "matchCode", "matchNumber", "nextMatchId", "round", "scheduledTime", "startTime", "status", "updatedAt" FROM "soccer_matches";
DROP TABLE "soccer_matches";
ALTER TABLE "new_soccer_matches" RENAME TO "soccer_matches";
CREATE UNIQUE INDEX "soccer_matches_matchCode_key" ON "soccer_matches"("matchCode");
CREATE UNIQUE INDEX "soccer_matches_nextMatchId_key" ON "soccer_matches"("nextMatchId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
