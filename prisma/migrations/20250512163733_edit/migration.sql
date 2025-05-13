/*
  Warnings:

  - You are about to drop the column `playerLoadoutId` on the `LoadoutElement` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "PlayerLoadoutToElement" (
    "playerLoadoutId" TEXT NOT NULL,
    "loadoutElementId" TEXT NOT NULL,

    PRIMARY KEY ("playerLoadoutId", "loadoutElementId"),
    CONSTRAINT "PlayerLoadoutToElement_playerLoadoutId_fkey" FOREIGN KEY ("playerLoadoutId") REFERENCES "PlayerLoadout" ("playerLoadoutId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlayerLoadoutToElement_loadoutElementId_fkey" FOREIGN KEY ("loadoutElementId") REFERENCES "LoadoutElement" ("loadoutElementId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LoadoutElement" (
    "loadoutElementId" TEXT NOT NULL PRIMARY KEY,
    "slotType" INTEGER NOT NULL,
    "itemAssetName" TEXT NOT NULL,
    "barycentricBlend" REAL,
    "baseBlend" REAL
);
INSERT INTO "new_LoadoutElement" ("barycentricBlend", "baseBlend", "itemAssetName", "loadoutElementId", "slotType") SELECT "barycentricBlend", "baseBlend", "itemAssetName", "loadoutElementId", "slotType" FROM "LoadoutElement";
DROP TABLE "LoadoutElement";
ALTER TABLE "new_LoadoutElement" RENAME TO "LoadoutElement";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
