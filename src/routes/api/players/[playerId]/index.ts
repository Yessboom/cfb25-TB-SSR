import type { APIEvent } from "@solidjs/start/server";
import { getSession } from "~/lib/server";
import { db } from "~/lib/db";
import { getPortraitImage } from "~/utils/portraitMapping";



export const GET = async (event: APIEvent) => {
    console.log('🔍 GET player API called with params:', event.params);
    try {
        const playerId = event.params.playerId;
        console.log('🔍 Player ID:', playerId);
        
        // Validate playerId
        if (!playerId) {
            console.log("Error")
        return new Response(JSON.stringify({ error: "Player ID is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
        }
    
        // Fetch player data from the database
        const player = await db.player.findFirst({
        where: { id : playerId },

        });
        console.log('🔍 Player data fetched:', player);
    
        if (!player) {
        return new Response(JSON.stringify({ error: "Player not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" }
        });
        }

                console.log('🖼️ Processing player portrait...');
        
        // Add portrait images to player data
        const playerWithPortrait = {
            ...player,
            portraitImage: getPortraitImage(player.portrait, false),
            portraitThumbnail: getPortraitImage(player.portrait, true)
        };
    
        return new Response(JSON.stringify({ 
        success: true, 
        player : playerWithPortrait
        }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
        });
    
    } catch (error) {
        console.error('❌ GET player error:', error);
        return new Response(JSON.stringify({ 
        error: error instanceof Error ? error.message : "Failed to fetch player data" 
        }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
        });
    }
    }