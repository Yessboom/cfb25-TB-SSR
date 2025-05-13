// Updated import script for roster and visual data
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

// Helper to safely parse values or return 0
const safeParseInt = (value) => parseInt(value) || 0;
const safeParseFloat = (value) => parseFloat(value) || 0.0;
const safeBigInt = (value) => {
  try {
    return BigInt(value);
  } catch {
    return BigInt(0);
  }
};

async function importRostersAndVisuals() {
    try {
      console.log('Starting import process...');
      const characters = ['powerhouse',  'spread'];
      
      // Cache for loadout elements
      const loadoutElementsCache = new Map();
  
      for (const characterName of characters) {
        console.log(`Processing ${characterName}...`);
        const dataRosterPath = path.join("public/rostertest", `${characterName}-roster.json`);
        const dataVisualPath = path.join("public/visualstest", `${characterName}-visual.json`);
  
        const rosterData = JSON.parse(await fs.readFile(dataRosterPath, 'utf8'));
        const visualData = JSON.parse(await fs.readFile(dataVisualPath, 'utf8'));
  
        const placeholderUser = await prisma.user.upsert({
          where: { userId: 'template-system' },
          update: {},
          create: { userId: 'template-system', username: 'Template System', password: 'template-system' },
        });
  
        const roster = await prisma.roster.create({
          data: {
            name: characterName,
            isTemplate: true,
            userId: placeholderUser.userId,
          }
        });
  
        for (const playerId in rosterData) {
          const playerRosterData = rosterData[playerId] || {};
          const playerVisualData = visualData[playerId] || {};

          // SKIP if this playerId already exists in *this* roster
          const existingPlayer = await prisma.player.findFirst({
            where: {
              playerId: playerId,
              rosterId: roster.rosterId
            }
          });
          if (existingPlayer) {
            console.log(`Skipping ${playerId} in roster ${roster.rosterId}`);
            continue;
          }

          const uniquePlayerId = randomUUID();

          const playerData = {
            id: uniquePlayerId,
            playerId,
            firstName: playerRosterData.PLYR_FIRSTNAME || '',
            lastName: playerRosterData.PLYR_LASTNAME || '',
            jerseyNumber: safeParseInt(playerRosterData.PLYR_JERSEYNUM),
            overallRating: safeParseInt(playerRosterData.PLYR_OVERALLRATING),
            speed: safeParseInt(playerRosterData.PLYR_SPEED),
            acceleration: safeParseInt(playerRosterData.PLYR_ACCELERATION),
            strength: safeParseInt(playerRosterData.PLYR_STRENGTH),
            agility: safeParseInt(playerRosterData.PLYR_AGILITY),
            height: safeParseInt(playerRosterData.PLYR_HEIGHT),
            weightPounds: safeParseInt(playerRosterData.PLYR_WEIGHT),
            age: safeParseInt(playerRosterData.PLYR_AGE),
            awareness: safeParseInt(playerRosterData.PLYR_AWARENESS),
            catching: safeParseInt(playerRosterData.PLYR_CATCHING),
            carrying: safeParseInt(playerRosterData.PLYR_CARRYING),
            throwPower: safeParseInt(playerRosterData.PLYR_THROWPOWER),
            throwAccuracy: safeParseInt(playerRosterData.PLYR_THROWACCURACY),
            kickPower: safeParseInt(playerRosterData.PLYR_KICKPOWER),
            kickAccuracy: safeParseInt(playerRosterData.PLYR_KICKACCURACY),
            runBlock: safeParseInt(playerRosterData.PLYR_RUNBLOCK),
            passBlock: safeParseInt(playerRosterData.PLYR_PASSBLOCK),
            tackle: safeParseInt(playerRosterData.PLYR_TACKLE),
            jumping: safeParseInt(playerRosterData.PLYR_JUMPING),
            kickReturn: safeParseInt(playerRosterData.PLYR_KICKRETURN),
            injury: safeParseInt(playerRosterData.PLYR_INJURY),
            stamina: safeParseInt(playerRosterData.PLYR_STAMINA),
            toughness: safeParseInt(playerRosterData.PLYR_TOUGHNESS),
            trucking: safeParseInt(playerRosterData.PLYR_TRUCKING),
            changeOfDirection: safeParseInt(playerRosterData.PLYR_CHANGEOFDIRECTION),
            backfieldVision: safeParseInt(playerRosterData.PLYR_BCVISION),
            stiffArm: safeParseInt(playerRosterData.PLYR_STIFFARM),
            spinMove: safeParseInt(playerRosterData.PLYR_SPINMOVE),
            jukeMove: safeParseInt(playerRosterData.PLYR_JUKEMOVE),
            impactBlocking: safeParseInt(playerRosterData.PLYR_IMPACTBLOCKING),
            runBlockPower: safeParseInt(playerRosterData.PLYR_RUNBLOCKPOWER),
            runBlockFinesse: safeParseInt(playerRosterData.PLYR_RUNBLOCKFINESSE),
            passBlockPower: safeParseInt(playerRosterData.PLYR_PASSBLOCKPOWER),
            passBlockFinesse: safeParseInt(playerRosterData.PLYR_PASSBLOCKFINESSE),
            powerMoves: safeParseInt(playerRosterData.PLYR_POWERMOVES),
            finesseMoves: safeParseInt(playerRosterData.PLYR_FINESSEMOVES),
            blockShedding: safeParseInt(playerRosterData.PLYR_BLOCKSHEDDING),
            pursuit: safeParseInt(playerRosterData.PLYR_PURSUIT),
            playRecognition: safeParseInt(playerRosterData.PLYR_PLAYRECOGNITION),
            manCoverage: safeParseInt(playerRosterData.PLYR_MANCOVERAGE),
            zoneCoverage: safeParseInt(playerRosterData.PLYR_ZONECOVERAGE),
            spectacularCatch: safeParseInt(playerRosterData.PLYR_SPECTACULARCATCH),
            catchInTraffic: safeParseInt(playerRosterData.PLYR_CATCHINTRAFFIC),
            mediumRouteRun: safeParseInt(playerRosterData.PLYR_MEDROUTERUN),
            hitPower: safeParseInt(playerRosterData.PLYR_HITPOWER),
            position: safeParseInt(playerRosterData.PLYR_POSITION),
            potential: safeParseInt(playerRosterData.PLYR_POTENTIAL),
            home_town: playerRosterData.PLYR_HOME_TOWN || '',
            home_state: safeParseInt(playerRosterData.PLYR_HOME_STATE),
            college: safeParseInt(playerRosterData.PLYR_COLLEGE),
            contractYearsLeft: safeParseInt(playerRosterData.PLYR_CONTRACTYEARSLEFT),
            validTotalSalary: safeParseFloat(playerRosterData.PLYR_VALIDTOTALSALARY),
            validSignBonus: safeParseFloat(playerRosterData.PLYR_VALIDSIGNBONUS),
            salary1: safeParseFloat(playerRosterData.PLYR_SALARY1),
            validContractLen: safeParseInt(playerRosterData.PLYR_VALIDCONTRACTLEN),
            careerPhase: safeParseInt(playerRosterData.PLYR_CAREERPHASE),
            genericHead: safeParseInt(playerRosterData.PLYR_GENERICHEAD),
            genericHeadName: playerVisualData.genericHeadName || '',
            bodyType: playerVisualData.bodyType ? parseInt(playerVisualData.bodyType, 10) : 1,
            skinTone: playerVisualData.skinTone || '',
            skinToneScale: safeBigInt(playerVisualData.skinToneScale),
            longSnapRating: safeParseInt(playerRosterData.PLYR_LONGSNAPRATING),
            portrait: safeParseInt(playerRosterData.PLYR_PORTRAIT),
            performLevel: safeParseInt(playerRosterData.PLYR_PERFORMLEVEL),
            consecYearsWithTeam: safeParseInt(playerRosterData.PLYR_CONSECYEARSWITHTEAM),
            sleeveTemperature: safeParseInt(playerRosterData.PLYR_SLEEVETEMPERATURE),
            runningStyle: safeParseInt(playerRosterData.PLYR_RUNNINGSTYLE),
            ego: safeParseInt(playerRosterData.PLYR_EGO),
            handedness: safeParseInt(playerRosterData.PLYR_HANDEDNESS),
            muscle: safeParseInt(playerRosterData.PLYR_MUSCLE),
            style: safeParseInt(playerRosterData.PLYR_STYLE),
            prevTeamId: safeParseInt(playerRosterData.PLYR_PREVTEAMID),
            flagProBowl: safeParseInt(playerRosterData.PLYR_FLAGPROBOWL),
            traitDevelopment: safeParseInt(playerRosterData.PLYR_TRAITDEVELOPMENT),
            isCaptain: playerRosterData.PLYR_ISCAPTAIN === "1",
            isImpactPlayer: playerRosterData.PLYR_IS_IMPACT_PLAYER === "1",
            isEditAllowed: playerRosterData.PLYR_IS_EDIT_ALLOWED === "1",
            isGuestStar: playerRosterData.PLYR_IS_GUEST_STAR === "True",
            throwAccuracyShort: safeParseInt(playerRosterData.PLYR_THROWACCURACYSHORT),
            throwAccuracyMid: safeParseInt(playerRosterData.PLYR_THROWACCURACYMID),
            throwAccuracyDeep: safeParseInt(playerRosterData.PLYR_THROWACCURACYDEEP),
            playAction: safeParseInt(playerRosterData.PLYR_PLAYACTION),
            throwOnTheRun: safeParseInt(playerRosterData.PLYR_THROWONTHERUN),
            breakTackle: safeParseInt(playerRosterData.PLYR_BREAKTACKLE),
            breakSack: safeParseInt(playerRosterData.PLYR_BREAKSACK),
            throwUnderPressure: safeParseInt(playerRosterData.PLYR_THROWUNDERPRESSURE),
            leadBlock: safeParseInt(playerRosterData.PLYR_LEADBLOCK),
            shortRouteRun: safeParseInt(playerRosterData.PLYR_SHORTROUTERUN),
            deepRouteRun: safeParseInt(playerRosterData.PLYR_DEEPROUTERUN),
            origId: safeParseInt(playerRosterData.PLYR_ORIGID),
            assetName: playerRosterData.PLYR_ASSETNAME || '',
            characterBodyType: safeParseInt(playerRosterData.PLYR_CHARACTERBODYTYPE),
            rosterId: roster.rosterId
          };

          const player = await prisma.player.create({ data: playerData });

          // Process loadouts
          if (playerVisualData.loadouts && playerVisualData.loadouts.length > 0) {
            for (const loadoutData of playerVisualData.loadouts) {
              // Create a loadout for the player
              const loadout = await prisma.playerLoadout.create({
                data: {
                  playerId:       player.id,               // use the PK of the just‐created Player
                  userId:         placeholderUser.userId,  // supply your upserted user
                  loadoutType:    loadoutData.loadoutType,
                  loadoutCategory: loadoutData.loadoutCategory,
                }
              });
  
              if (loadoutData.loadoutElements && loadoutData.loadoutElements.length > 0) {
                for (const element of loadoutData.loadoutElements) {
                  // Create a unique key for caching
                  const elementKey = `${element.slotType}:${element.itemAssetName}`;
                  const barycentricBlend = element.blends?.[0]?.barycentricBlend || 0;
                  const baseBlend = element.blends?.[0]?.baseBlend || 0;
                  
                  // Check if we've seen this exact element before
                  let loadoutElementId;
                  
                  if (loadoutElementsCache.has(elementKey)) {
                    // We've seen this element before, reuse it
                    loadoutElementId = loadoutElementsCache.get(elementKey);
                  } else {
                    // Check if this element already exists in the database
                    const existingElement = await prisma.loadoutElement.findFirst({
                      where: {
                        slotType: element.slotType,
                        itemAssetName: element.itemAssetName,
                        barycentricBlend: barycentricBlend,
                        baseBlend: baseBlend
                      }
                    });
                    
                    if (existingElement) {
                      // Use the existing element
                      loadoutElementId = existingElement.loadoutElementId;
                    } else {
                      // Create a new element
                      const newElement = await prisma.loadoutElement.create({
                        data: {
                          slotType: element.slotType,
                          itemAssetName: element.itemAssetName,
                          barycentricBlend: barycentricBlend,
                          baseBlend: baseBlend
                        }
                      });
                      loadoutElementId = newElement.loadoutElementId;
                    }
                    
                    // Cache this element for future reference
                    loadoutElementsCache.set(elementKey, loadoutElementId);
                  }
                  
                  // Now create the join table entry to link this element to the loadout
                  await prisma.PlayerLoadoutToElement.create({
                    data: {
                      loadoutElementId: loadoutElementId,
                      playerLoadoutId: loadout.playerLoadoutId
                    }
                  });
                }
              }
            }
          }
        }
      }
      console.log('Import process completed successfully!');
    } catch (error) {
      console.error('Error during import:', error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }
  
  importRostersAndVisuals()
    .then(() => {
      console.log('Script execution complete.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Script execution failed:', error);
      process.exit(1);
    });