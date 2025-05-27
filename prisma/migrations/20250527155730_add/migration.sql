/*
  Warnings:

  - Added the required column `birthdate` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bottom` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `captainspatch` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `comment` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fatigue` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minovr` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `morale` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playerType` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `portrait_force_silhouette` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `portrait_swappable_library_path` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `press` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qbstyle` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `redshirted` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reserved1` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reservedunit10` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role2` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schoolyear` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stance` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `top` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vismovetype` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Player" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "jerseyNumber" INTEGER NOT NULL,
    "overallRating" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "acceleration" INTEGER NOT NULL,
    "strength" INTEGER NOT NULL,
    "agility" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "weightPounds" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "awareness" INTEGER NOT NULL,
    "catching" INTEGER NOT NULL,
    "carrying" INTEGER NOT NULL,
    "throwPower" INTEGER NOT NULL,
    "throwAccuracy" INTEGER NOT NULL,
    "kickPower" INTEGER NOT NULL,
    "kickAccuracy" INTEGER NOT NULL,
    "runBlock" INTEGER NOT NULL,
    "passBlock" INTEGER NOT NULL,
    "tackle" INTEGER NOT NULL,
    "jumping" INTEGER NOT NULL,
    "kickReturn" INTEGER NOT NULL,
    "injury" INTEGER NOT NULL,
    "stamina" INTEGER NOT NULL,
    "toughness" INTEGER NOT NULL,
    "trucking" INTEGER NOT NULL,
    "changeOfDirection" INTEGER NOT NULL,
    "backfieldVision" INTEGER NOT NULL,
    "stiffArm" INTEGER NOT NULL,
    "spinMove" INTEGER NOT NULL,
    "jukeMove" INTEGER NOT NULL,
    "impactBlocking" INTEGER NOT NULL,
    "runBlockPower" INTEGER NOT NULL,
    "runBlockFinesse" INTEGER NOT NULL,
    "passBlockPower" INTEGER NOT NULL,
    "passBlockFinesse" INTEGER NOT NULL,
    "powerMoves" INTEGER NOT NULL,
    "finesseMoves" INTEGER NOT NULL,
    "blockShedding" INTEGER NOT NULL,
    "pursuit" INTEGER NOT NULL,
    "playRecognition" INTEGER NOT NULL,
    "release" INTEGER NOT NULL,
    "manCoverage" INTEGER NOT NULL,
    "zoneCoverage" INTEGER NOT NULL,
    "spectacularCatch" INTEGER NOT NULL,
    "catchInTraffic" INTEGER NOT NULL,
    "mediumRouteRun" INTEGER NOT NULL,
    "hitPower" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "potential" INTEGER NOT NULL,
    "home_town" TEXT,
    "home_state" INTEGER,
    "college" INTEGER,
    "contractYearsLeft" INTEGER NOT NULL,
    "validTotalSalary" REAL NOT NULL,
    "validSignBonus" REAL NOT NULL,
    "salary1" REAL NOT NULL,
    "validContractLen" INTEGER NOT NULL,
    "careerPhase" INTEGER NOT NULL,
    "genericHead" INTEGER NOT NULL,
    "genericHeadName" TEXT,
    "bodyType" INTEGER,
    "skinTone" INTEGER NOT NULL,
    "skinToneScale" BIGINT NOT NULL,
    "rosterId" TEXT,
    "longSnapRating" INTEGER NOT NULL,
    "portrait" INTEGER NOT NULL,
    "performLevel" INTEGER NOT NULL,
    "consecYearsWithTeam" INTEGER NOT NULL,
    "sleeveTemperature" INTEGER NOT NULL,
    "runningStyle" INTEGER NOT NULL,
    "ego" INTEGER NOT NULL,
    "handedness" INTEGER NOT NULL,
    "muscle" INTEGER NOT NULL,
    "style" INTEGER NOT NULL,
    "prevTeamId" INTEGER NOT NULL,
    "flagProBowl" INTEGER NOT NULL,
    "traitDevelopment" INTEGER NOT NULL,
    "isCaptain" BOOLEAN NOT NULL,
    "isImpactPlayer" BOOLEAN NOT NULL,
    "isEditAllowed" BOOLEAN NOT NULL,
    "isGuestStar" BOOLEAN NOT NULL,
    "throwAccuracyShort" INTEGER NOT NULL,
    "throwAccuracyMid" INTEGER NOT NULL,
    "throwAccuracyDeep" INTEGER NOT NULL,
    "playAction" INTEGER NOT NULL,
    "throwOnTheRun" INTEGER NOT NULL,
    "breakTackle" INTEGER NOT NULL,
    "breakSack" INTEGER NOT NULL,
    "throwUnderPressure" INTEGER NOT NULL,
    "leadBlock" INTEGER NOT NULL,
    "shortRouteRun" INTEGER NOT NULL,
    "deepRouteRun" INTEGER NOT NULL,
    "press" INTEGER NOT NULL,
    "origId" INTEGER NOT NULL,
    "assetName" TEXT NOT NULL,
    "characterBodyType" INTEGER NOT NULL,
    "minovr" INTEGER NOT NULL,
    "vismovetype" INTEGER NOT NULL,
    "top" INTEGER NOT NULL,
    "bottom" INTEGER NOT NULL,
    "captainspatch" INTEGER NOT NULL,
    "reserved1" INTEGER NOT NULL,
    "reservedunit10" INTEGER NOT NULL,
    "icon" INTEGER NOT NULL,
    "role2" INTEGER NOT NULL,
    "birthdate" INTEGER NOT NULL,
    "qbstyle" INTEGER NOT NULL,
    "stance" INTEGER NOT NULL,
    "morale" INTEGER NOT NULL,
    "fatigue" INTEGER NOT NULL,
    "playerType" INTEGER NOT NULL,
    "portrait_swappable_library_path" INTEGER NOT NULL,
    "portrait_force_silhouette" INTEGER NOT NULL,
    "schoolyear" INTEGER NOT NULL,
    "redshirted" INTEGER NOT NULL,
    "comment" INTEGER NOT NULL,
    CONSTRAINT "Player_rosterId_fkey" FOREIGN KEY ("rosterId") REFERENCES "Roster" ("rosterId") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Player" ("acceleration", "age", "agility", "assetName", "awareness", "backfieldVision", "blockShedding", "bodyType", "breakSack", "breakTackle", "careerPhase", "carrying", "catchInTraffic", "catching", "changeOfDirection", "characterBodyType", "college", "consecYearsWithTeam", "contractYearsLeft", "deepRouteRun", "ego", "finesseMoves", "firstName", "flagProBowl", "genericHead", "genericHeadName", "handedness", "height", "hitPower", "home_state", "home_town", "id", "impactBlocking", "injury", "isCaptain", "isEditAllowed", "isGuestStar", "isImpactPlayer", "jerseyNumber", "jukeMove", "jumping", "kickAccuracy", "kickPower", "kickReturn", "lastName", "leadBlock", "longSnapRating", "manCoverage", "mediumRouteRun", "muscle", "origId", "overallRating", "passBlock", "passBlockFinesse", "passBlockPower", "performLevel", "playAction", "playRecognition", "playerId", "portrait", "position", "potential", "powerMoves", "prevTeamId", "pursuit", "release", "rosterId", "runBlock", "runBlockFinesse", "runBlockPower", "runningStyle", "salary1", "shortRouteRun", "skinTone", "skinToneScale", "sleeveTemperature", "spectacularCatch", "speed", "spinMove", "stamina", "stiffArm", "strength", "style", "tackle", "throwAccuracy", "throwAccuracyDeep", "throwAccuracyMid", "throwAccuracyShort", "throwOnTheRun", "throwPower", "throwUnderPressure", "toughness", "traitDevelopment", "trucking", "validContractLen", "validSignBonus", "validTotalSalary", "weightPounds", "zoneCoverage") SELECT "acceleration", "age", "agility", "assetName", "awareness", "backfieldVision", "blockShedding", "bodyType", "breakSack", "breakTackle", "careerPhase", "carrying", "catchInTraffic", "catching", "changeOfDirection", "characterBodyType", "college", "consecYearsWithTeam", "contractYearsLeft", "deepRouteRun", "ego", "finesseMoves", "firstName", "flagProBowl", "genericHead", "genericHeadName", "handedness", "height", "hitPower", "home_state", "home_town", "id", "impactBlocking", "injury", "isCaptain", "isEditAllowed", "isGuestStar", "isImpactPlayer", "jerseyNumber", "jukeMove", "jumping", "kickAccuracy", "kickPower", "kickReturn", "lastName", "leadBlock", "longSnapRating", "manCoverage", "mediumRouteRun", "muscle", "origId", "overallRating", "passBlock", "passBlockFinesse", "passBlockPower", "performLevel", "playAction", "playRecognition", "playerId", "portrait", "position", "potential", "powerMoves", "prevTeamId", "pursuit", "release", "rosterId", "runBlock", "runBlockFinesse", "runBlockPower", "runningStyle", "salary1", "shortRouteRun", "skinTone", "skinToneScale", "sleeveTemperature", "spectacularCatch", "speed", "spinMove", "stamina", "stiffArm", "strength", "style", "tackle", "throwAccuracy", "throwAccuracyDeep", "throwAccuracyMid", "throwAccuracyShort", "throwOnTheRun", "throwPower", "throwUnderPressure", "toughness", "traitDevelopment", "trucking", "validContractLen", "validSignBonus", "validTotalSalary", "weightPounds", "zoneCoverage" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
CREATE UNIQUE INDEX "Player_playerId_rosterId_key" ON "Player"("playerId", "rosterId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
