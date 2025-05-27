import { db } from './db'
import { query, action, redirect } from "@solidjs/router"
import { z } from 'zod'
import { Roster, Player, PlayerLoadout } from "~/types"
import { getSession } from './server'
import { getPortraitImage } from '~/utils/portraitMapping'

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

export const getMyRosters = query(async () => {
  'use server'
  const session = await getSession()
  if (!session) throw new Error('Not authenticated')
  return await db.roster.findMany({
    where: { userId: session.data.userId },
    include: {
      players: true,
      user:    true
    }
  })
}, 'getMyRosters')

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

    if (!roster) return null;
    // Map players to include portrait image
        const playersWithPortraits = roster.players.map(player => ({
      ...player,
      portraitImage: getPortraitImage(player.portrait, false),
      portraitThumbnail: getPortraitImage(player.portrait, true)
    }));
    return {
      ...roster,
      players: playersWithPortraits
    };

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
    
    if (!player) return null;
    return {
      ...player,
      portraitImage: getPortraitImage(player.portrait, false),
      portraitThumbnail: getPortraitImage(player.portrait, true)
    };
  } catch (error) {
    console.error(`Failed to fetch player ${playerId}:`, error);
    throw new Error("Failed to load player details");
  }
}, "player-details");



// Schema for creating roster from template
const createRosterFromTemplateSchema = z.object({
  templateId: z.string(),
  rosterName: z.string().min(1, "Roster name is required"),
});


export const createRosterFromTemplate = async (form: FormData) => {
  'use server'
  
  const data = createRosterFromTemplateSchema.parse({
    templateId: form.get('templateId'),
    rosterName: form.get('rosterName'),
  });
  
  try {
    const session = await getSession();
    const currentUserId = session.data.userId;
    if (!currentUserId) {
      throw new Error("User not authenticated");
    }

    // Get the template roster with all its players and their loadouts
    const templateRoster = await db.roster.findUnique({
      where: { 
        rosterId: data.templateId,
        isTemplate: true 
      },
      include: {
        players: {
          include: {
            loadouts: {
              include: {
                loadoutElements: true
              }
            }
          }
        }
      }
    });

    if (!templateRoster) {
      throw new Error("Template roster not found");
    }

    // Create the new roster
    const newRoster = await db.roster.create({
      data: {
        name: data.rosterName,
        userId: currentUserId,
        isTemplate: false, // New roster is not a template
        players: {
          create: templateRoster.players.map(player => ({
            // Copy all player data except id and rosterId
            playerId: player.playerId,
            firstName: player.firstName,
            lastName: player.lastName,
            jerseyNumber: player.jerseyNumber,
            overallRating: player.overallRating,
            
            // Physical Attributes
            speed: player.speed,
            acceleration: player.acceleration,
            strength: player.strength,
            agility: player.agility,
            height: player.height,
            weightPounds: player.weightPounds,
            age: player.age,
            
            // Performance Attributes
            awareness: player.awareness,
            catching: player.catching,
            carrying: player.carrying,
            throwPower: player.throwPower,
            throwAccuracy: player.throwAccuracy,
            kickPower: player.kickPower,
            kickAccuracy: player.kickAccuracy,
            runBlock: player.runBlock,
            passBlock: player.passBlock,
            tackle: player.tackle,
            jumping: player.jumping,
            kickReturn: player.kickReturn,
            injury: player.injury,
            stamina: player.stamina,
            toughness: player.toughness,
            
            // Advanced Performance Attributes
            trucking: player.trucking,
            changeOfDirection: player.changeOfDirection,
            backfieldVision: player.backfieldVision,
            stiffArm: player.stiffArm,
            spinMove: player.spinMove,
            jukeMove: player.jukeMove,
            impactBlocking: player.impactBlocking,
            runBlockPower: player.runBlockPower,
            runBlockFinesse: player.runBlockFinesse,
            passBlockPower: player.passBlockPower,
            passBlockFinesse: player.passBlockFinesse,
            powerMoves: player.powerMoves,
            finesseMoves: player.finesseMoves,
            blockShedding: player.blockShedding,
            pursuit: player.pursuit,
            playRecognition: player.playRecognition,
            
            // Coverage and Special Skills
            manCoverage: player.manCoverage,
            zoneCoverage: player.zoneCoverage,
            spectacularCatch: player.spectacularCatch,
            catchInTraffic: player.catchInTraffic,
            mediumRouteRun: player.mediumRouteRun,
            hitPower: player.hitPower,
            
            // Additional Attributes
            position: player.position,
            potential: player.potential,
            home_town: player.home_town,
            home_state: player.home_state,
            college: player.college,
            
            // Contract and Career Details
            contractYearsLeft: player.contractYearsLeft,
            validTotalSalary: player.validTotalSalary,
            validSignBonus: player.validSignBonus,
            salary1: player.salary1,
            validContractLen: player.validContractLen,
            careerPhase: player.careerPhase,
            
            // Visual and Equipment Data
            genericHead: player.genericHead,
            genericHeadName: player.genericHeadName,
            bodyType: player.bodyType,
            skinTone: player.skinTone,
            skinToneScale: player.skinToneScale,
            
            // Additional Flags and Miscellaneous
            longSnapRating: player.longSnapRating,
            portrait: player.portrait,
            performLevel: player.performLevel,
            consecYearsWithTeam: player.consecYearsWithTeam,
            sleeveTemperature: player.sleeveTemperature,
            runningStyle: player.runningStyle,
            ego: player.ego,
            handedness: player.handedness,
            muscle: player.muscle,
            style: player.style,
            prevTeamId: player.prevTeamId,
            flagProBowl: player.flagProBowl,
            traitDevelopment: player.traitDevelopment,
            isCaptain: player.isCaptain,
            isImpactPlayer: player.isImpactPlayer,
            isEditAllowed: player.isEditAllowed,
            isGuestStar: player.isGuestStar,
            
            // Specific Skill Attributes
            throwAccuracyShort: player.throwAccuracyShort,
            throwAccuracyMid: player.throwAccuracyMid,
            throwAccuracyDeep: player.throwAccuracyDeep,
            playAction: player.playAction,
            throwOnTheRun: player.throwOnTheRun,
            breakTackle: player.breakTackle,
            breakSack: player.breakSack,
            throwUnderPressure: player.throwUnderPressure,
            leadBlock: player.leadBlock,
            shortRouteRun: player.shortRouteRun,
            deepRouteRun: player.deepRouteRun,
            release: player.release,
            press: player.press,
            
            // Identifiers
            origId: player.origId,
            assetName: player.assetName,
            characterBodyType: player.characterBodyType,

            //miscellaneous
            minovr: player.minovr,
            vismovetype: player.vismovetype,
            top: player.top,
            bottom: player.bottom,
            captainspatch : player.captainspatch,
            reserved1: player.reserved1,
            reservedunit10: player.reservedunit10,
            icon: player.icon,
            role2: player.role2,
            birthdate: player.birthdate,
            qbstyle: player.qbstyle,
            stance: player.stance,
            morale: player.morale,
            fatigue: player.fatigue,
            playerType: player.playerType,
            portrait_swappable_library_path: player.portrait_swappable_library_path,
            portrait_force_silhouette: player.portrait_force_silhouette,
            schoolyear: player.schoolyear,
            redshirted: player.redshirted,
            comment: player.comment,


            
            // Create loadouts for the new player
            loadouts: {
              create: player.loadouts.map(loadout => ({
                userId: currentUserId,
                loadoutType: loadout.loadoutType,
                loadoutCategory: loadout.loadoutCategory,
                loadoutElements: {
                  connect: loadout.loadoutElements.map(element => ({
                    loadoutElementId: element.loadoutElementId
                  }))
                }
              }))
            }
          }))
        }
      },
      include: {
        players: {
          include: {
            loadouts: {
              include: {
                loadoutElements: true
              }
            }
          }
        }
      }
    });

    // Redirect to the newly created roster's details page
    throw redirect(`/rosters/${newRoster.rosterId}`);
    
  } catch (error) {
    // If it's a redirect, re-throw it
    if (error instanceof Response) {
      throw error;
    }
    
    console.error("Failed to create roster from template:", error);
    throw new Error("Failed to create roster from template");
  }
};

export const createRosterFromTemplateAction = action(createRosterFromTemplate);

export async function deleteRosterById(rosterId: string) {
  "use server"
  const session = await getSession()
  if (!session) throw new Error("Not authenticated")
  const r = await db.roster.findUnique({ where: { rosterId } })
  if (!r || r.userId !== session.data.userId) {
    throw new Error("Not found or no permission")
  }
  await db.roster.delete({ where: { rosterId } })
}
export const deleteRosterAction = action(deleteRosterById)

export async function renameRoster(formData: FormData) {
  "use server"
  const session = await getSession()
  if (!session) throw new Error("Not authenticated")
  
  const rosterId = formData.get("rosterId") as string
  const newName = formData.get("name") as string
  
  if (!rosterId || !newName) {
    throw new Error("Missing required fields")
  }
  
  const roster = await db.roster.findUnique({ where: { rosterId } })
  if (!roster || roster.userId !== session.data.userId) {
    throw new Error("Roster not found or access denied")
  }
  
  await db.roster.update({
    where: { rosterId },
    data: { name: newName.trim() }
  })
  
  return { success: true }
}
export const renameRosterAction = action(renameRoster);