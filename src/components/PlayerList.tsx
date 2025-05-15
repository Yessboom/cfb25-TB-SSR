import { For } from "solid-js";
import PlayerRow from "./PlayerRow";
import { Player } from "~/types";

export default function PlayerList({ 
  players, 
  selectedPlayerId,
  onSelectPlayer 
}: { 
  players: Player[];
  selectedPlayerId?: string;
  onSelectPlayer?: (player: Player) => void;
}) {
  return (
    <div class="overflow-auto max-h-[700px] w-full">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50 sticky top-0">
          <tr>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Jersey</th>
            <th class="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pos</th>
            <th class="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">OVR</th>
            <th class="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <For each={players}>
            {player => (
              <PlayerRow 
                player={player} 
                isSelected={selectedPlayerId === player.id}
                onSelect={onSelectPlayer}
              />
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
}