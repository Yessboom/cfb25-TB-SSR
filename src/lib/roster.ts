import { db } from './db'
import { query, action } from "@solidjs/router"
import { z } from 'zod'
import { Roster, Player, PlayerLoadout } from "~/types"

export const getRosters = query(async () => {
  'use server'
  return await db.roster.findMany({
    include: {
      players: true,
      user: true
    }
  })
}, 'getRosters')

export const getTemplateRosters = query(async () => {
  "use server";
  try {
    const templates = await db.roster.findMany({
      where: { isTemplate: true },
      include: {
        players: true,
        user: true
      }
    });
    
    return templates;
  } catch (error) {
    console.error("Failed to fetch template rosters:", error);
    throw error
  }
}, "template-rosters");

export const getRosterWithPlayers = query(async (rosterId: string) => {
  "use server";
  try {
    const roster = await db.roster.findUnique({
      where: { rosterId },
      include: {
        players: {
          orderBy: [
            { position: 'asc' },
            { overallRating: 'desc' }
          ]
        },
        user: true
      }
    });
    
    if (!roster) throw new Error("Roster not found");
    return roster;
  } catch (error) {
    console.error(`Failed to fetch roster ${rosterId}:`, error);
    throw new Error("Failed to load roster details");
  }
}, "roster-details");

export const getPlayerDetails = query(async (playerId: string) => {
  "use server";
  try {
    const player = await db.player.findUnique({
      where: { id: playerId },
      include: {
        loadouts: {
          include: {
            loadoutElements: true 
          }
        },
        roster: true
      }
    });
    
    if (!player) throw new Error("Player not found");
    return player;
  } catch (error) {
    console.error(`Failed to fetch player ${playerId}:`, error);
    throw new Error("Failed to load player details");
  }
}, "player-details");



