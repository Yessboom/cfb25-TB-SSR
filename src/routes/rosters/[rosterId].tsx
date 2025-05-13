import { createAsync, type RouteDefinition } from "@solidjs/router";
import { getRosterWithPlayers } from "~/lib/roster";
import PlayerDetails from "~/components/PlayerDetails";

export const route = {
  preload({ params }) { getRosterWithPlayers(params.rosterId) }
} satisfies RouteDefinition;

export default function RosterDetails({ params }: { params: { rosterId: string } }) {
  const roster = createAsync(() => getRosterWithPlayers(params.rosterId), { deferStream: true });

  return (
    <main class="w-full p-4 space-y-4">
      <h1 class="text-3xl font-bold">Roster Details</h1>

      {roster() ? (
        <>
          <h2>{roster()!.name}</h2>
          <p>Created by: {roster()!.user?.username ?? "Unknown"}</p>
          <div class="players-list">
            {roster()!.players.map(player => (
              <PlayerDetails player={{ ...player, loadouts: [] }} />
            ))}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </main>
  );
}
