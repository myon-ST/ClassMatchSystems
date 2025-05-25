/*
  Warnings:

  - You are about to drop the `SoccerMatch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SoccerMatch";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Team";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "softball_matches" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "matchCode" TEXT NOT NULL,
    "round" INTEGER NOT NULL,
    "matchNumber" INTEGER NOT NULL,
    "team1" TEXT NOT NULL,
    "team2" TEXT NOT NULL,
    "team1Scores" TEXT NOT NULL,
    "team2Scores" TEXT NOT NULL,
    "team1Total" INTEGER NOT NULL DEFAULT 0,
    "team2Total" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "winner" TEXT,
    "scheduledTime" TEXT NOT NULL DEFAULT '',
    "startTime" TEXT NOT NULL DEFAULT '',
    "endTime" TEXT NOT NULL DEFAULT '',
    "isJankenNeeded" BOOLEAN NOT NULL DEFAULT false,
    "jankenWinner" TEXT,
    "isHomeFirst" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "softball_rankings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "className" TEXT NOT NULL,
    "rank" INTEGER,
    "rankText" TEXT,
    "eliminatedAt" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "basketball_matches" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "matchCode" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "round" INTEGER NOT NULL,
    "matchNumber" INTEGER NOT NULL,
    "team1" TEXT NOT NULL,
    "team2" TEXT NOT NULL,
    "team1FirstHalf" INTEGER NOT NULL DEFAULT 0,
    "team1SecondHalf" INTEGER NOT NULL DEFAULT 0,
    "team1FreeThrow" INTEGER NOT NULL DEFAULT 0,
    "team2FirstHalf" INTEGER NOT NULL DEFAULT 0,
    "team2SecondHalf" INTEGER NOT NULL DEFAULT 0,
    "team2FreeThrow" INTEGER NOT NULL DEFAULT 0,
    "team1Total" INTEGER NOT NULL DEFAULT 0,
    "team2Total" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "winner" TEXT,
    "scheduledTime" TEXT NOT NULL DEFAULT '',
    "startTime" TEXT NOT NULL DEFAULT '',
    "endTime" TEXT NOT NULL DEFAULT '',
    "isFreeThrowNeeded" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "basketball_rankings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "className" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "rank" INTEGER,
    "rankText" TEXT,
    "eliminatedAt" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "softball_matches_matchCode_key" ON "softball_matches"("matchCode");

-- CreateIndex
CREATE UNIQUE INDEX "softball_rankings_className_key" ON "softball_rankings"("className");

-- CreateIndex
CREATE UNIQUE INDEX "basketball_matches_matchCode_key" ON "basketball_matches"("matchCode");

-- CreateIndex
CREATE UNIQUE INDEX "basketball_rankings_className_gender_key" ON "basketball_rankings"("className", "gender");
