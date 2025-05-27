import { getSession } from "~/lib/server";
import { db } from "~/lib/db";
import type { APIEvent } from "@solidjs/start/server";


export const GET = async (event: APIEvent) => {
  try {
    const rosterId = event.params.rosterId;
    const session = await getSession();
    const userId = session?.data?.userId;
    
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Get roster with all players
    const roster = await db.roster.findUnique({
      where: { rosterId },
      include: {
        players: true,
        user: { select: { username: true } }
      }
    });

    if (!roster || roster.userId !== userId) {
      return new Response("Roster not found or unauthorized", { status: 404 });
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
        PLYR_CHARACTERBODYTYPE: player.characterBodyType.toString(),
        
        // Additional fields that might be needed for proper game import
        PLYR_BODYTYPE: (player.bodyType || 0).toString(),
        PLYR_SKINTONE: player.skinTone.toString(),
        PLYR_SKINTONESCALE: player.skinToneScale.toString(),
        PLYR_GENERICHEADNAME: player.genericHeadName || ""
      };
    });

    const jsonString = JSON.stringify(rosterJson, null, 2);
    const filename = `${roster.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'roster'}.json`;
    
    return new Response(jsonString, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': jsonString.length.toString()
      }
    });
    
  } catch (error) {
    console.error("Download error:", error);
    return new Response("Download failed", { status: 500 });
  }
};