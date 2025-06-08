import type { APIEvent } from "@solidjs/start/server";
import { db } from "~/lib/db";

export const GET = async (event: APIEvent) => {
  try {
    const templates = await db.roster.findMany({
      where: { isTemplate: true },
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
        },
        user: {
          select: {
            username: true
          }
        }
      }
    });

    return new Response(JSON.stringify({ 
      success: true, 
      templates: templates.map(template => ({
        rosterId: template.rosterId,
        name: template.name,
        playerCount: template.players.length,
        createdBy: template.user?.username || 'Unknown',
        players: template.players
      }))
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: "Failed to fetch template rosters" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};