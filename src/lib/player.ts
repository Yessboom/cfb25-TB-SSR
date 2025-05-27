// actions/player.ts
import { action } from "@solidjs/router";
import { db } from "./db";
import { getSession } from "./server";

export const updatePlayerBasicInfo = action(async (formData: FormData) => {
  "use server";
  
  try {
    const session = await getSession();
    const userId = session.data.userId;
    if (!userId) throw new Error("User not authenticated");

    const playerId = String(formData.get("playerId"));
    const field = String(formData.get("field"));
    const value = String(formData.get("value"));

    // Verify the player belongs to a roster owned by this user
    const player = await db.player.findFirst({
      where: {
        id: playerId,
        roster: {
          userId: userId
        }
      }
    });

    if (!player) {
      throw new Error("Player not found or access denied");
    }

    // Handle different field types
    let updateData: any = {};
    
    if (field === "firstName" || field === "lastName") {
      updateData[field] = value;
    } else if (field === "jerseyNumber") {
      updateData[field] = parseInt(value);
    } else if (field === "age") {
      updateData[field] = parseInt(value);
    } else if (field === "height") {
      updateData[field] = parseInt(value);
    } else if (field === "weightPounds") {
      updateData[field] = parseInt(value);
    }

    await db.player.update({
      where: { id: playerId },
      data: updateData
    });

    return { success: true };
  } catch (error) {
    console.error("Update player basic info error:", error);
    return { error: error instanceof Error ? error.message : "Update failed" };
  }
});

export const updatePlayerSkill = action(async (formData: FormData) => {
  "use server";
  
  try {
    const session = await getSession();
    const userId = session.data.userId;
    if (!userId) throw new Error("User not authenticated");

    const playerId = String(formData.get("playerId"));
    const skillName = String(formData.get("skillName"));
    const skillValue = parseInt(String(formData.get("skillValue")));

    // Validate skill value range
    if (skillValue < 0 || skillValue > 99) {
      throw new Error("Skill value must be between 0 and 99");
    }

    // Verify the player belongs to a roster owned by this user
    const player = await db.player.findFirst({
      where: {
        id: playerId,
        roster: {
          userId: userId
        }
      }
    });

    if (!player) {
      throw new Error("Player not found or access denied");
    }

    // Validate skill name exists in schema
    const validSkills = [
      "speed", "acceleration", "strength", "agility", "jumping", "stamina", 
      "toughness", "injury", "awareness", "throwPower", "throwAccuracy", 
      "throwAccuracyShort", "throwAccuracyMid", "throwAccuracyDeep", 
      "playAction", "throwOnTheRun", "throwUnderPressure", "breakSack",
      "carrying", "trucking", "backfieldVision", "stiffArm", "spinMove", 
      "jukeMove", "breakTackle", "changeOfDirection", "catching", 
      "spectacularCatch", "catchInTraffic", "shortRouteRun", "mediumRouteRun", 
      "deepRouteRun", "kickReturn", "runBlock", "passBlock", "impactBlocking", 
      "runBlockPower", "runBlockFinesse", "passBlockPower", "passBlockFinesse", 
      "leadBlock", "tackle", "hitPower", "powerMoves", "finesseMoves", 
      "blockShedding", "pursuit", "playRecognition", "manCoverage", 
      "zoneCoverage", "kickPower", "kickAccuracy", "longSnapRating"
    ];

    if (!validSkills.includes(skillName)) {
      throw new Error("Invalid skill name");
    }

    await db.player.update({
      where: { id: playerId },
      data: { [skillName]: skillValue }
    });

    return { success: true };
  } catch (error) {
    console.error("Update player skill error:", error);
    return { error: error instanceof Error ? error.message : "Update failed" };
  }
});