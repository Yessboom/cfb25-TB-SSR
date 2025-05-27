import { Prisma } from '@prisma/client'

// Use Prisma's generated types as base
export type User = Prisma.UserGetPayload<{
  include: { rosters: true; playerLoadouts: true }
}>

export type Roster = Prisma.RosterGetPayload<{
  include: { user: true; players: true }
}>

export type Player = Prisma.PlayerGetPayload<{
  include: { roster: true; loadouts: true }
}>

export type PlayerLoadout = Prisma.PlayerLoadoutGetPayload<{
  include: { player: true; user: true; loadoutElements: true }
}>

export type LoadoutElement = Prisma.LoadoutElementGetPayload<{
  include: { playerLoadouts: true }
}>
