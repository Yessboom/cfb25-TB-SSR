import { createAsync, type RouteDefinition } from "@solidjs/router";
import { getRosterWithPlayers } from "~/lib/roster";
import { useParams, A } from "@solidjs/router";
import PlayerDetails from "~/components/PlayerDetails";

export const route = {
  load({ params }) { 
    return getRosterWithPlayers(params.rosterId); 
  }
} satisfies RouteDefinition;

export default function RosterDetails() {
  const params = useParams();
  const roster = createAsync(() => getRosterWithPlayers(params.rosterId), { deferStream: true });

  return (
    <main class="w-full p-4 space-y-4">
      <h1 class="text-3xl font-bold">Roster Details</h1>

      <div class="mb-4">
        <A href="/rostersTemplate" class="text-blue-600 hover:underline">
          ← Back to Templates
        </A>
      </div>

      {roster() ? (
        <>
          <h2 class="text-2xl font-semibold">{roster()!.name}</h2>
          <p>Created by: {roster()!.user?.username ?? "Unknown"}</p>
          <div class="players-list mt-6">
            <h3 class="text-xl font-semibold mb-3">Players</h3>
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