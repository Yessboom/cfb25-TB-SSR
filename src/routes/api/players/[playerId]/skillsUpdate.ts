import type { APIEvent } from "@solidjs/start/server";
import { getSession } from "~/lib/server";
import { db } from "~/lib/db";

export const PATCH = async (event: APIEvent) => {
  try {
    const session = await getSession();
    const userId = session.data.userId;
    const playerId = event.params.playerId;
    
    if (!userId) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const body = await event.request.json();
    const { skillName, skillValue } = body;

    // Validate skill value range
    if (skillValue < 0 || skillValue > 99) {
      return new Response(JSON.stringify({ error: "Skill value must be between 0 and 99" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Verify the player belongs to the user
    const player = await db.player.findFirst({
      where: { 
        id: playerId,
        roster: { userId }
      }
    });

    if (!player) {
      return new Response(JSON.stringify({ error: "Player not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Validate skill name (using your existing validSkills array)
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
      return new Response(JSON.stringify({ error: "Invalid skill name" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const updatedPlayer = await db.player.update({
      where: { id: playerId },
      data: { [skillName]: skillValue }
    });

    return new Response(JSON.stringify({ 
      success: true, 
      player: updatedPlayer 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: "Failed to update player skill" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};