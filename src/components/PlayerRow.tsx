import { getPositionName } from "../utils/utils";
import { Player } from "~/types";

export default function PlayerRow({ 
  player, 
  isSelected, 
  onSelect 
}: { 
  player: Player;
  isSelected?: boolean;
  onSelect?: (player: Player) => void;
}) {
  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    if (onSelect) {
      onSelect(player);
    }
  };

  return (
    <tr 
      class={`cursor-pointer hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
      onClick={handleClick}
    >
      <td class="align-middle px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-800 text-left">
        <span class="block">{player.firstName} {player.lastName}</span>
      </td>
      <td class="align-middle px-2 py-2 whitespace-nowrap text-sm text-center text-gray-500">
        {player.jerseyNumber}
      </td>
      <td class="align-middle px-2 py-2 whitespace-nowrap text-sm text-center text-gray-500">
        {getPositionName(player.position)}
      </td>
      <td class="align-middle px-2 py-2 whitespace-nowrap text-sm text-center">
        <span class={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
          player.overallRating >= 85 ? "bg-green-100 text-green-800" :
          player.overallRating >= 75 ? "bg-blue-100 text-blue-800" :
          player.overallRating >= 65 ? "bg-yellow-100 text-yellow-800" :
          "bg-red-100 text-red-800"
        }`}>
          {player.overallRating}
        </span>
      </td>
      <td class="align-middle px-2 py-2 whitespace-nowrap text-sm text-center text-gray-500">
        {player.age}
      </td>
    </tr>
  );
}