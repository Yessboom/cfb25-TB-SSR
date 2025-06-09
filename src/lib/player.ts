import { action, redirect } from "@solidjs/router";
import { db } from "./db";
import { getSession } from "./server";
import { getPortraitImage } from "~/utils/portraitMapping";

export const updatePlayerBasicInfo = action(async (formData: FormData) => {
  "use server";
  
  // Debug logging
  console.log("=== updatePlayerBasicInfo Debug ===");
  console.log("FormData entries:");
  for (const [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }
  
  try {
    const session = await getSession();
    const userId = session.data.userId;
    if (!userId) throw new Error("User not authenticated");

    const playerId = String(formData.get("playerId"));
    const field = String(formData.get("field"));
    const value = String(formData.get("value"));
    const redirectPath = formData.get("redirect") as string;

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
    }else if (field === "isImpactPlayer") {
      updateData[field] = value === "1" || value === "true";
    }

    await db.player.update({
      where: { id: playerId },
      data: updateData
    });

    // If redirect path is provided (no-JS scenario), redirect back to the page
    if (redirectPath) {
      // Parse current URL to preserve search params
      const url = new URL(redirectPath, 'http://localhost'); // base URL needed for parsing
      
      // Ensure the selected player is preserved in the URL
      if (!url.searchParams.has('selected')) {
        url.searchParams.set('selected', playerId);
      }
      
      // Redirect to the same page with preserved params
      throw redirect(url.pathname + url.search);
    }

    return { success: true };
  } catch (error) {
    console.error("Update player basic info error:", error);
    
    // Handle redirect errors 
    if (error && typeof error === 'object' && 'status' in error && error.status === 302) {
      throw error;
    }
    
    const redirectPath = formData.get("redirect") as string;
    if (redirectPath) {
      // For no-JS scenario, redirect back with error
      throw redirect(redirectPath);
    }
    
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
    const redirectPath = formData.get("redirect") as string;

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
      "zoneCoverage", "kickPower", "kickAccuracy", "longSnapRating", "press", "release"
    ];

    if (!validSkills.includes(skillName)) {
      throw new Error("Invalid skill name");
    }

    await db.player.update({
      where: { id: playerId },
      data: { [skillName]: skillValue }
    });

    // If redirect path is provided (no-JS scenario), redirect back to the page
    if (redirectPath) {
      throw redirect(redirectPath);
    }

    return { success: true };
  } catch (error) {
    console.error("Update player skill error:", error);
    
    // Handle redirect errors (these are actually successful redirects)
    if (error && typeof error === 'object' && 'status' in error && error.status === 302) {
      throw error;
    }
    
    const redirectPath = formData.get("redirect") as string;
    if (redirectPath) {
      // For no-JS scenario, redirect back with error 
      throw redirect(redirectPath);
    }
    
    return { error: error instanceof Error ? error.message : "Update failed" };
  }
});