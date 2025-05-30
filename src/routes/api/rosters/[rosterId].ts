// src/routes/api/rosters/[rosterId]/index.ts
import type { APIEvent } from "@solidjs/start/server";
import { getSession } from "~/lib/server";
import { db } from "~/lib/db";
import { getPortraitImage } from "~/utils/portraitMapping";

export const GET = async (event: APIEvent) => {
  try {
    const rosterId = event.params.rosterId;
    
    const roster = await db.roster.findUnique({
      where: { rosterId },
      include: {
        players: {
          orderBy: [
            { position: 'asc' },
            { overallRating: 'desc' }
          ]
        },
        user: {
          select: {
            username: true
          }
        }
      }
    });

    if (!roster) {
      return new Response(JSON.stringify({ error: "Roster not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Map players to include portrait image
    const playersWithPortraits = roster.players.map(player => ({
      ...player,
      portraitImage: getPortraitImage(player.portrait, false),
      portraitThumbnail: getPortraitImage(player.portrait, true)
    }));

    return new Response(JSON.stringify({ 
      success: true, 
      roster: {
        ...roster,
        players: playersWithPortraits
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: "Failed to fetch roster" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const DELETE = async (event: APIEvent) => {
  try {
    const session = await getSession();
    const userId = session.data.userId;
    const rosterId = event.params.rosterId;
    
    if (!userId) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const roster = await db.roster.findUnique({ where: { rosterId } });
    if (!roster || roster.userId !== userId) {
      return new Response(JSON.stringify({ error: "Roster not found or access denied" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    await db.roster.delete({ where: { rosterId } });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Roster deleted successfully" 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: "Failed to delete roster" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const PATCH = async (event: APIEvent) => {
  try {
    const session = await getSession();
    const userId = session.data.userId;
    const rosterId = event.params.rosterId;
    
    if (!userId) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const body = await event.request.json();
    const { name } = body;

    if (!name) {
      return new Response(JSON.stringify({ error: "Roster name is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const roster = await db.roster.findUnique({ where: { rosterId } });
    if (!roster || roster.userId !== userId) {
      return new Response(JSON.stringify({ error: "Roster not found or access denied" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    const updatedRoster = await db.roster.update({
      where: { rosterId },
      data: { name: name.trim() }
    });

    return new Response(JSON.stringify({ 
      success: true, 
      roster: {
        id: updatedRoster.rosterId,
        name: updatedRoster.name
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: "Failed to update roster" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};