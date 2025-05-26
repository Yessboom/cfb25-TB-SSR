/*
  Warnings:

  - You are about to drop the `PlayerLoadoutToElement` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PlayerLoadoutToElement";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_PlayerLoadoutElements" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PlayerLoadoutElements_A_fkey" FOREIGN KEY ("A") REFERENCES "LoadoutElement" ("loadoutElementId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PlayerLoadoutElements_B_fkey" FOREIGN KEY ("B") REFERENCES "PlayerLoadout" ("playerLoadoutId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT,
    "password" TEXT NOT NULL
);
INSERT INTO "new_User" ("password", "userId", "username") SELECT "password", "userId", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_PlayerLoadoutElements_AB_unique" ON "_PlayerLoadoutElements"("A", "B");

-- CreateIndex
CREATE INDEX "_PlayerLoadoutElements_B_index" ON "_PlayerLoadoutElements"("B");
