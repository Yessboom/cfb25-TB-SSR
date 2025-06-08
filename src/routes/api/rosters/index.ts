import type { APIEvent } from "@solidjs/start/server";
import { getSession } from "~/lib/server";
import { db } from "~/lib/db";

export const GET = async (event: APIEvent) => {
  try {
    const session = await getSession();
    const userId = session.data.userId;
    
    if (!userId) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const rosters = await db.roster.findMany({
      where: { userId },
      include: {
        players: {
          select: {
            id: true,
            playerId: true,
            firstName: true,
            lastName: true,
            position: true,
            overallRating: true,
            jerseyNumber: true
          }
        }
      }
    });

    return new Response(JSON.stringify({ 
      success: true, 
      rosters: rosters.map(roster => ({
        rosterId: roster.rosterId,
        name: roster.name,
        isTemplate: roster.isTemplate,
        playerCount: roster.players.length,
        players: roster.players
      }))
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: "Failed to fetch rosters" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};