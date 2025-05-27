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



export const downloadRosterAction = action(async (formData: FormData) => {
  "use server";
  const rosterId = String(formData.get("rosterId"));
  
  try {
    const session = await getSession();
    const userId = session.data.userId;
    if (!userId) throw redirect("/login");

    // Get roster with all players
    const roster = await db.roster.findUnique({
      where: { rosterId },
      include: {
        players: true,
        user: { select: { username: true } }
      }
    });

    if (!roster || roster.userId !== userId) {
      throw new Error("Roster not found or unauthorized");
    }

    // Transform to the desired JSON format
    const rosterJson: Record<string, any> = {};
    
    roster.players.forEach(player => {
      rosterJson[player.playerId] = {
        PLYR_ID: player.playerId,
        PLYR_FIRSTNAME: player.firstName,
        PLYR_LASTNAME: player.lastName,
        PLYR_JERSEYNUM: player.jerseyNumber.toString(),
        PLYR_OVERALLRATING: player.overallRating.toString(),
        PLYR_SPEED: player.speed.toString(),
        PLYR_ACCELERATION: player.acceleration.toString(),
        PLYR_STRENGTH: player.strength.toString(),
        PLYR_AGILITY: player.agility.toString(),
        PLYR_AWARENESS: player.awareness.toString(),
        PLYR_CATCHING: player.catching.toString(),
        PLYR_CARRYING: player.carrying.toString(),
        PLYR_THROWPOWER: player.throwPower.toString(),
        PLYR_THROWACCURACY: player.throwAccuracy.toString(),
        PLYR_KICKPOWER: player.kickPower.toString(),
        PLYR_KICKACCURACY: player.kickAccuracy.toString(),
        PLYR_RUNBLOCK: player.runBlock.toString(),
        PLYR_PASSBLOCK: player.passBlock.toString(),
        PLYR_TACKLE: player.tackle.toString(),
        PLYR_JUMPING: player.jumping.toString(),
        PLYR_KICKRETURN: player.kickReturn.toString(),
        PLYR_INJURY: player.injury.toString(),
        PLYR_STAMINA: player.stamina.toString(),
        PLYR_TOUGHNESS: player.toughness.toString(),
        PLYR_LONGSNAPRATING: player.longSnapRating.toString(),
        PLYR_HEIGHT: player.height.toString(),
        PLYR_AGE: player.age.toString(),
        PLYR_CONTRACTYEARSLEFT: player.contractYearsLeft.toString(),
        PLYR_PORTRAIT: player.portrait.toString(),
        PLYR_COMMENT: player.comment.toString(),
        PLYR_SLEEVETEMPERATURE: player.sleeveTemperature.toString(),
        PLYR_PERFORMLEVEL: player.performLevel.toString(),
        PLYR_CONSECYEARSWITHTEAM: player.consecYearsWithTeam.toString(),
        PLYR_HOME_TOWN: player.home_town || "",
        PLYR_TRUCKING: player.trucking.toString(),
        PLYR_CHANGEOFDIRECTION: player.changeOfDirection.toString(),
        PLYR_BCVISION: player.backfieldVision.toString(),
        PLYR_STIFFARM: player.stiffArm.toString(),
        PLYR_SPINMOVE: player.spinMove.toString(),
        PLYR_JUKEMOVE: player.jukeMove.toString(),
        PLYR_IMPACTBLOCKING: player.impactBlocking.toString(),
        PLYR_RUNBLOCKPOWER: player.runBlockPower.toString(),
        PLYR_RUNBLOCKFINESSE: player.runBlockFinesse.toString(),
        PLYR_PASSBLOCKPOWER: player.passBlockPower.toString(),
        PLYR_PASSBLOCKFINESSE: player.passBlockFinesse.toString(),
        PLYR_POWERMOVES: player.powerMoves.toString(),
        PLYR_FINESSEMOVES: player.finesseMoves.toString(),
        PLYR_BLOCKSHEDDING: player.blockShedding.toString(),
        PLYR_PURSUIT: player.pursuit.toString(),
        PLYR_PLAYRECOGNITION: player.playRecognition.toString(),
        PLYR_MANCOVERAGE: player.manCoverage.toString(),
        PLYR_ZONECOVERAGE: player.zoneCoverage.toString(),
        PLYR_RUNNINGSTYLE: player.runningStyle.toString(),
        PLYR_SPECTACULARCATCH: player.spectacularCatch.toString(),
        PLYR_CATCHINTRAFFIC: player.catchInTraffic.toString(),
        PLYR_MEDROUTERUN: player.mediumRouteRun.toString(),
        PLYR_HITPOWER: player.hitPower.toString(),
        PLYR_PRESS: player.press.toString(),
        PLYR_RELEASE: player.release.toString(),
        PLYR_EGO: player.ego.toString(),
        PLYR_POTENTIAL: player.potential.toString(),
        PLYR_MIN_OVR: player.minovr.toString(),
        PLYR_VISMOVETYPE: player.vismovetype.toString(),
        PLYR_THROWACCURACYSHORT: player.throwAccuracyShort.toString(),
        PLYR_THROWACCURACYMID: player.throwAccuracyMid.toString(),
        PLYR_THROWACCURACYDEEP: player.throwAccuracyDeep.toString(),
        PLYR_PLAYACTION: player.playAction.toString(),
        PLYR_THROWONTHERUN: player.throwOnTheRun.toString(),
        PLYR_ORIGID: player.origId.toString(),
        PLYR_POSITION: player.position.toString(),
        PLYR_TOP: player.top.toString(),
        PLYR_BOTTOM: player.bottom.toString(),
        PLYR_CAPTAINSPATCH: player.captainspatch.toString(),
        PLYR_WEIGHT: player.weightPounds.toString(),
        PLYR_COLLEGE: (player.college || 0).toString(),
        PLYR_HOME_STATE: (player.home_state || 0).toString(),
        PLYR_VALIDTOTALSALARY: player.validTotalSalary.toString(),
        PLYR_VALIDSIGNBONUS: player.validSignBonus.toString(),
        PLYR_SALARY1: player.salary1.toString(),
        PLYR_VALIDCONTRACTLEN: player.validContractLen.toString(),
        PLYR_CAREERPHASE: player.careerPhase.toString(),
        PLYR_HANDEDNESS: player.handedness.toString(),
        PLYR_MUSCLE: player.muscle.toString(),
        PLYR_RESERVED1: player.reserved1.toString(),
        PLYR_STYLE: player.style.toString(),
        PLYR_PREVTEAMID: player.prevTeamId.toString(),
        PLYR_RESERVEDUINT10: player.reservedunit10.toString(),
        PLYR_GENERICHEAD: player.genericHead.toString(),
        PLYR_FLAGPROBOWL: player.flagProBowl.toString(),
        PLYR_ICON: player.icon.toString(),
        PLYR_TRAITDEVELOPMENT: player.traitDevelopment.toString(),
        PLYR_ROLE2: player.role2.toString(),
        PLYR_BIRTHDATE: player.birthdate.toString(),
        PLYR_ISCAPTAIN: player.isCaptain ? "1" : "0",
        PLYR_QBSTYLE: player.qbstyle.toString(),
        PLYR_STANCE: player.stance.toString(),
        PLYR_MORALE: player.morale.toString(),
        PLYR_FATIGUE: player.fatigue.toString(),
        PLYR_PLAYERTYPE: player.playerType.toString(),
        PLYR_ASSETNAME: player.assetName,
        PLYR_BREAKTACKLE: player.breakTackle.toString(),
        PLYR_BREAKSACK: player.breakSack.toString(),
        PLYR_THROWUNDERPRESSURE: player.throwUnderPressure.toString(),
        PLYR_LEADBLOCK: player.leadBlock.toString(),
        PLYR_SHORTROUTERUN: player.shortRouteRun.toString(),
        PLYR_DEEPROUTERUN: player.deepRouteRun.toString(),
        PLYR_PORTRAIT_SWAPPABLE_LIBRARY_PATH: player.portrait_swappable_library_path.toString(),
        PLYR_PORTRAIT_FORCE_SILHOUETTE: player.portrait_force_silhouette ? "True" : "False",
        PLYR_IS_GUEST_STAR: player.isGuestStar ? "True" : "False",
        PLYR_SCHOOLYEAR: player.schoolyear.toString(),
        PLYR_IS_IMPACT_PLAYER: player.isImpactPlayer ? "1" : "0",
        PLYR_REDSHIRTED: player.redshirted.toString(),
        PLYR_IS_EDIT_ALLOWED: player.isEditAllowed ? "1" : "0",
        PLYR_CHARACTERBODYTYPE: player.characterBodyType.toString()
      };
    });

    // Create the download response
    const jsonString = JSON.stringify(rosterJson, null, 2);
    const filename = `${roster.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'roster'}.json`;
    
    // Return a Response with proper headers for download
    return new Response(jsonString, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': jsonString.length.toString()
      }
    });
    
  } catch (err) {
    return err as Error;
  }
});