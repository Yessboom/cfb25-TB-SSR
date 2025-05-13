import { getPositionName } from "../utils/utils";
import { Player } from "~/types";

export interface PlayerListProps {
  players: Player[];
}

export default function PlayerList(props: PlayerListProps) {
  return (
    <div class="overflow-auto max-h-[700px] w-full">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50 sticky top-0">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Jersey</th>
            <th class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pos</th>
            <th class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">OVR</th>
            <th class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {props.players.map((player) => (
            <tr>
              <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-800">
                <span class="block">{player.firstName} {player.lastName}</span>
              </td>
              <td class="px-2 py-2 whitespace-nowrap text-sm text-center text-gray-500">
                {player.jerseyNumber}
              </td>
              <td class="px-2 py-2 whitespace-nowrap text-sm text-center text-gray-500">
                {getPositionName(player.position)}
              </td>
              <td class="px-2 py-2 whitespace-nowrap text-sm text-center">
                <span class={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                  player.overallRating >= 85 ? "bg-green-100 text-green-800" :
                  player.overallRating >= 75 ? "bg-blue-100 text-blue-800" :
                  player.overallRating >= 65 ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {player.overallRating}
                </span>
              </td>
              <td class="px-2 py-2 whitespace-nowrap text-sm text-center text-gray-500">
                {player.age}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
