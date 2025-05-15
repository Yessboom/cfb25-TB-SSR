import { createAsync, type RouteDefinition } from "@solidjs/router";
import { getRosterWithPlayers } from "~/lib/roster";
import { useParams, A } from "@solidjs/router";
import { createSignal, createEffect, Show, onMount } from "solid-js";
import PlayerDetails from "~/components/PlayerDetails";
import PlayerList from "~/components/PlayerList";
import { Player } from "~/types";
import {useSearchParams} from "@solidjs/router";

export const route = {
  load({ params }) { 
    return getRosterWithPlayers(params.rosterId); 
  }
} satisfies RouteDefinition;

export default function RosterDetails() {
  const params = useParams();
  const [searchParams] = useSearchParams();

  const roster = createAsync(() => getRosterWithPlayers(params.rosterId), { deferStream: true });
  
  const selectedPlayerId = () => searchParams.selected ?? null;
  const selectedPlayer = () => {
  const rosterData = roster();
    if (!rosterData || !selectedPlayerId()) return null;
    return rosterData.players.find(p => p.id === selectedPlayerId()) ?? null;
  };


  // Debug: Log when the component mounts
  onMount(() => {
    console.log("RosterDetails component mounted");
  });

  // Handle player selection
  const handleSelectPlayer = (player: Player) => {
    console.log("handleSelectPlayer called with:", player);

    
    // Verify state was updated
    setTimeout(() => {
      console.log("After selection, state is:", { 
        selectedPlayerId: selectedPlayerId(), 
        selectedPlayer: selectedPlayer() 
      });
    }, 0);
  };



  // Debug: Log when roster or selected player changes
  createEffect(() => {
    console.log("Roster data:", roster());
  });

  createEffect(() => {
    console.log("Selected player ID:", selectedPlayerId());
    console.log("Selected player:", selectedPlayer());
  });

  return (
    <main class="w-full p-4 space-y-4">
      <h1 class="text-3xl font-bold">Roster Details</h1>

      <div class="mb-4">
        <A href="/rostersTemplate" class="text-blue-600 hover:underline">
          ← Back to Templates
        </A>
      </div>

      <Show when={roster()} fallback={<p>Loading...</p>}>
        {(rosterData) => (
          <>
            <h2 class="text-2xl font-semibold">{rosterData().name}</h2>
            <p>Created by: {rosterData().user?.username ?? "Unknown"}</p>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div class="players-list">
                <h3 class="text-xl font-semibold mb-3">Players</h3>
                <PlayerList 
                  players={rosterData().players as Player[]} 
                  selectedPlayerId={selectedPlayerId()}
                  onSelectPlayer={handleSelectPlayer}
                />
              </div>

              <div class="player-details">
                <h3 class="text-xl font-semibold mb-3">Player Details</h3>
                <div id="player-details-container">
                  {/* Debug info to verify data is passing */}
                  <div class="mb-2 text-sm text-gray-500">
                    Selected Player ID: {selectedPlayerId() || "None"}
                  </div>
<                 PlayerDetails player={selectedPlayer} />
                </div>
              </div>
            </div>
          </>
        )}
      </Show>
    </main>
  );
}