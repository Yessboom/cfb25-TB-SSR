// src/routes/api/rosters/[rosterId]/index.ts
import type { APIEvent } from "@solidjs/start/server";
import { getSession } from "~/lib/server";
import { db } from "~/lib/db";
import { getPortraitImage } from "~/utils/portraitMapping";

// Helper function to convert BigInt values to strings
const convertBigIntToString = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'bigint') {
    return obj.toString();
  }
  
  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToString);
  }
  
  if (typeof obj === 'object') {
    const converted: any = {};
    for (const [key, value] of Object.entries(obj)) {
      converted[key] = convertBigIntToString(value);
    }
    return converted;
  }
  
  return obj;
};

export const GET = async (event: APIEvent) => {
  try {
    const rosterId = event.params.rosterId;
    
    console.log('🔍 GET roster API called with rosterId:', rosterId);
    
    if (!rosterId) {
      console.log('❌ No rosterId provided');
      return new Response(JSON.stringify({ error: "Roster ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    console.log('🔍 Querying database for roster:', rosterId);
    
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

    console.log('🔍 Database query result:', roster ? `Found roster: ${roster.name}` : 'No roster found');

    if (!roster) {
      console.log('❌ Roster not found in database');
      return new Response(JSON.stringify({ error: "Roster not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    console.log('🔍 Processing', roster.players.length, 'players with portraits');

    // Map players to include portrait image and convert BigInt values
    const playersWithPortraits = roster.players.map(player => {
      try {
        const playerData = {
          ...player,
          portraitImage: getPortraitImage(player.portrait, false),
          portraitThumbnail: getPortraitImage(player.portrait, true)
        };
        
        // Convert any BigInt values to strings
        return convertBigIntToString(playerData);
      } catch (portraitError) {
        console.error('❌ Error processing portrait for player:', player.playerId, portraitError);
        const playerData = {
          ...player,
          portraitImage: null,
          portraitThumbnail: null
        };
        
        return convertBigIntToString(playerData);
      }
    });

    console.log('✅ Successfully processed roster data');

    // Convert the entire roster object to handle any BigInt values
    const rosterData = convertBigIntToString({
      ...roster,
      players: playersWithPortraits
    });

    return new Response(JSON.stringify({ 
      success: true, 
      roster: rosterData
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error('❌ GET roster error:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
    
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Failed to fetch roster" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

// Apply the same fix to your DELETE and PATCH methods
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
    console.error('❌ DELETE roster error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Failed to delete roster" 
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

    // Convert BigInt values before returning
    const rosterData = convertBigIntToString(updatedRoster);

    return new Response(JSON.stringify({ 
      success: true, 
      roster: {
        id: rosterData.rosterId,
        name: rosterData.name
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error('❌ PATCH roster error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Failed to update roster" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};