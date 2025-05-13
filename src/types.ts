// types.ts
export interface User {
  userId: string;
  username: string | null;
  password: string;
  rosters: Roster[];
  playerLoadouts: PlayerLoadout[];
}

export interface Roster {
  rosterId: string;
  name: string | null;
  userId: string;
  isTemplate: boolean;
  user?: User | null;
  players: Player[];
}

export interface Player {
  id: string;
  playerId: string;
  firstName: string;
  lastName: string;
  jerseyNumber: number;
  overallRating: number;
  
  // Physical Attributes
  speed: number;
  acceleration: number;
  strength: number;
  agility: number;
  height: number;
  weightPounds: number;
  age: number;
  
  // Performance Attributes
  awareness: number;
  catching: number;
  carrying: number;
  throwPower: number;
  throwAccuracy: number;
  kickPower: number;
  kickAccuracy: number;
  runBlock: number;
  passBlock: number;
  tackle: number;
  jumping: number;
  kickReturn: number;
  injury: number;
  stamina: number;
  toughness: number;
  
  // Advanced Performance Attributes
  trucking: number;
  changeOfDirection: number;
  backfieldVision: number;
  stiffArm: number;
  spinMove: number;
  jukeMove: number;
  impactBlocking: number;
  runBlockPower: number;
  runBlockFinesse: number;
  passBlockPower: number;
  passBlockFinesse: number;
  powerMoves: number;
  finesseMoves: number;
  blockShedding: number;
  pursuit: number;
  playRecognition: number;
  
  // Coverage and Special Skills
  manCoverage: number;
  zoneCoverage: number;
  spectacularCatch: number;
  catchInTraffic: number;
  mediumRouteRun: number;
  hitPower: number;
  
  // Additional Attributes
  position: number;
  potential: number;
  home_town: string | null;
  home_state: number | null;
  college: number | null;
  
  // Contract and Career Details
  contractYearsLeft: number;
  validTotalSalary: number;
  validSignBonus: number;
  salary1: number;
  validContractLen: number;
  careerPhase: number;
  
  // Visual and Equipment Data
  genericHead: number;
  genericHeadName: string | null;
  bodyType: number | null;
  skinTone: number;
  skinToneScale: bigint; // Note: BigInt in TS
  
  // Roster Relationship
  rosterId: string | null;
  roster?: Roster | null;
  
  // Equipment Loadouts
  loadouts: PlayerLoadout[];
  
  // Additional Flags and Miscellaneous
  longSnapRating: number;
  portrait: number;
  performLevel: number;
  consecYearsWithTeam: number;
  sleeveTemperature: number;
  runningStyle: number;
  ego: number;
  handedness: number;
  muscle: number;
  style: number;
  prevTeamId: number;
  flagProBowl: number;
  traitDevelopment: number;
  isCaptain: boolean;
  isImpactPlayer: boolean;
  isEditAllowed: boolean;
  isGuestStar: boolean;
  
  // Specific Skill Attributes
  throwAccuracyShort: number;
  throwAccuracyMid: number;
  throwAccuracyDeep: number;
  playAction: number;
  throwOnTheRun: number;
  breakTackle: number;
  breakSack: number;
  throwUnderPressure: number;
  leadBlock: number;
  shortRouteRun: number;
  deepRouteRun: number;
  
  // Identifiers
  origId: number;
  assetName: string;
  characterBodyType: number;
}

export interface PlayerLoadout {
  playerLoadoutId: string;
  playerId: string;
  userId: string | null;
  player?: Player | null;
  user?: User | null;
  loadoutType: number;
  loadoutCategory: number;
  loadoutElements: PlayerLoadoutToElement[];
}

export interface LoadoutElement {
  loadoutElementId: string;
  slotType: number;
  itemAssetName: string;
  barycentricBlend: number | null;
  baseBlend: number | null;
  playerLoadouts: PlayerLoadoutToElement[];
}

export interface PlayerLoadoutToElement {
  playerLoadoutId: string;
  loadoutElementId: string;
  playerLoadout: PlayerLoadout;
  loadoutElement: LoadoutElement;
}