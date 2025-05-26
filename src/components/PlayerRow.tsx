import { A } from "@solidjs/router";
import { Player } from "~/types";
import { getPositionName } from "~/utils/utils";

export default function PlayerRow({
  player,
  isSelected,
  href = "",
}: {
  player: Player;
  isSelected?: boolean;
  href?: string;
}) {
  return (
    <tr class={isSelected ? "bg-blue-100" : ""}>
      <td colSpan={5} class="p-0">
        <A 
          href={href} 
          class="flex w-full hover:bg-gray-100 px-4 py-2 text-sm text-gray-900 no-underline"
        >
          <div class="w-1/5">{player.firstName} {player.lastName}</div>
          <div class="w-1/5 text-center">{player.jerseyNumber}</div>
          <div class="w-1/5 text-center">{getPositionName(player.position)}</div>
          <div class="w-1/5 text-center">{player.overallRating}</div>
          <div class="w-1/5 text-center">{player.age}</div>
        </A>
      </td>
    </tr>
  );
}
