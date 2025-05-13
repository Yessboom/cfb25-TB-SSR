-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "password" TEXT
);

-- CreateTable
CREATE TABLE "Roster" (
    "rosterId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Roster_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Player" (
    "playerId" TEXT NOT NULL PRIMARY KEY,
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
    "bodyType" INTEGER NOT NULL,
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
    "origId" INTEGER NOT NULL,
    "assetName" TEXT NOT NULL,
    "characterBodyType" INTEGER NOT NULL,
    CONSTRAINT "Player_rosterId_fkey" FOREIGN KEY ("rosterId") REFERENCES "Roster" ("rosterId") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlayerLoadout" (
    "playerLoadoutId" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "loadoutType" INTEGER NOT NULL,
    "loadoutCategory" INTEGER NOT NULL,
    CONSTRAINT "PlayerLoadout_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("playerId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LoadoutElement" (
    "loadoutElementId" TEXT NOT NULL PRIMARY KEY,
    "playerLoadoutId" TEXT NOT NULL,
    "slotType" INTEGER NOT NULL,
    "itemAssetName" TEXT NOT NULL,
    "barycentricBlend" REAL,
    "baseBlend" REAL,
    CONSTRAINT "LoadoutElement_playerLoadoutId_fkey" FOREIGN KEY ("playerLoadoutId") REFERENCES "PlayerLoadout" ("playerLoadoutId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_playerId_key" ON "Player"("playerId");
