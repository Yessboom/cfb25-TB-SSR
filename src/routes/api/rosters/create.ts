import type { APIEvent } from "@solidjs/start/server";
import { getSession } from "~/lib/server";
import { db } from "~/lib/db";

export const POST = async (event: APIEvent) => {
  try {
    const session = await getSession();
    const userId = session.data.userId;
    
    if (!userId) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const body = await event.request.json();
    const { templateId, rosterName } = body;

    if (!templateId || !rosterName) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Get the template roster with all its players and their loadouts
    const templateRoster = await db.roster.findUnique({
      where: { 
        rosterId: templateId,
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
      return new Response(JSON.stringify({ error: "Template roster not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Create the new roster with ALL fields from  server action
    const newRoster = await db.roster.create({
      data: {
        name: rosterName,
        userId: userId,
        isTemplate: false,
        players: {
          create: templateRoster.players.map(player => ({
            // Basic Info
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

            // Miscellaneous
            minovr: player.minovr,
            vismovetype: player.vismovetype,
            top: player.top,
            bottom: player.bottom,
            captainspatch: player.captainspatch,
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
                userId: userId,
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

    return new Response(JSON.stringify({ 
      success: true, 
      roster: {
        id: newRoster.rosterId,
        name: newRoster.name,
        playerCount: newRoster.players.length
      }
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error("Failed to create roster from template:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Failed to create roster" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};