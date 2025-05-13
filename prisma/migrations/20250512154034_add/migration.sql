-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PlayerLoadout" (
    "playerLoadoutId" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "userId" TEXT,
    "loadoutType" INTEGER NOT NULL,
    "loadoutCategory" INTEGER NOT NULL,
    CONSTRAINT "PlayerLoadout_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("playerId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlayerLoadout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_PlayerLoadout" ("loadoutCategory", "loadoutType", "playerId", "playerLoadoutId") SELECT "loadoutCategory", "loadoutType", "playerId", "playerLoadoutId" FROM "PlayerLoadout";
DROP TABLE "PlayerLoadout";
ALTER TABLE "new_PlayerLoadout" RENAME TO "PlayerLoadout";
CREATE TABLE "new_Roster" (
    "rosterId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "userId" TEXT NOT NULL,
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Roster_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Roster" ("name", "rosterId", "userId") SELECT "name", "rosterId", "userId" FROM "Roster";
DROP TABLE "Roster";
ALTER TABLE "new_Roster" RENAME TO "Roster";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
