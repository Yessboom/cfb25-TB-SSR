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
    const { field, value } = body;

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

    // Handle different field types
    let updateData: any = {};
    
    if (field === "firstName" || field === "lastName") {
      updateData[field] = value;
    } else if (["jerseyNumber", "age", "height", "weightPounds"].includes(field)) {
      updateData[field] = parseInt(value);
    } else if (field === "isImpactPlayer") {
      updateData[field] = value === "1" || value === "true";
    }

    const updatedPlayer = await db.player.update({
      where: { id: playerId },
      data: updateData
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
      error: "Failed to update player" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};