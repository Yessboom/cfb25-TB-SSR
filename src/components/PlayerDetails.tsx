import { Player } from "~/types";

export default function PlayerDetails({ player }: { player: Player }) {
  return (
    <div class="player-details border p-4 mb-4">
      <h3 class="text-xl font-bold">{player.firstName} {player.lastName}</h3>
      <p>Position: {player.position}</p>
      <p>Overall Rating: {player.overallRating}</p>
      <p>Speed: {player.speed}</p>
      <p>Strength: {player.strength}</p>
      <p>Agility: {player.agility}</p>
      <p>Height: {player.height} cm</p>
      <p>Weight: {player.weightPounds} lbs</p>
      <p>Age: {player.age}</p>
    </div>
  );
}
