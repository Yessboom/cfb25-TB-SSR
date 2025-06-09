import { createEffect, onMount } from "solid-js";
import { Player } from "~/types";
import { getPositionName } from "../utils/utils";
import { formatHeight } from "../utils/utils";


//Component not used
export default function PlayerDetailsAlternative({ player }: { player: Player | null | undefined }) {
  // Debug: Log when component mounts
  onMount(() => {
    console.log("PlayerDetailsAlternative component mounted");
  });

  // Debug: Log when player prop changes
  createEffect(() => {
    console.log("PlayerDetailsAlternative player prop:", player);
  });

  if (!player) {
    return (
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <p class="p-4 text-gray-500">Select a player to view details</p>
      </div>
    );
  }

  return (
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6 bg-gray-50">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {player.firstName} {player.lastName}
        </h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          #{player.jerseyNumber} • {getPositionName(player.position)}
        </p>
      </div>
      <div class="border-t border-gray-200">
        <dl>
          {/* Overall Rating */}
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Overall Rating</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <span class={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                player.overallRating >= 85 ? "bg-green-100 text-green-800" :
                player.overallRating >= 75 ? "bg-blue-100 text-blue-800" :
                player.overallRating >= 65 ? "bg-yellow-100 text-yellow-800" :
                "bg-red-100 text-red-800"
              }`}>
                {player.overallRating}
              </span>
            </dd>
          </div>

          {/* Age */}
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Age</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{player.age}</dd>
          </div>

          {/* Position */}
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Position</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{getPositionName(player.position)}</dd>
          </div>

          {/* Height */}
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Height</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatHeight(player.height)}</dd>
          </div>

          {/* Weight */}
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Weight</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{player.weightPounds} lbs</dd>
          </div>
          
          {/* Physical Attributes Section */}
          <div class="bg-gray-50 px-4 py-5 sm:px-6">
            <h4 class="text-base font-medium text-gray-900">Physical Attributes</h4>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6">
            <div>
              <div class="mb-3">
                <span class="block text-sm font-medium text-gray-700">Speed</span>
                <span class="block text-sm text-gray-900">{player.speed}</span>
              </div>
              <div class="mb-3">
                <span class="block text-sm font-medium text-gray-700">Acceleration</span>
                <span class="block text-sm text-gray-900">{player.acceleration}</span>
              </div>
            </div>
            <div>
              <div class="mb-3">
                <span class="block text-sm font-medium text-gray-700">Strength</span>
                <span class="block text-sm text-gray-900">{player.strength}</span>
              </div>
              <div class="mb-3">
                <span class="block text-sm font-medium text-gray-700">Agility</span>
                <span class="block text-sm text-gray-900">{player.agility}</span>
              </div>
            </div>
          </div>
          
          {/* Loadouts - Only show if available */}
          {player.loadouts && player.loadouts.length > 0 && (
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Loadouts</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul class="border border-gray-200 rounded-md divide-y divide-gray-200">
                  {player.loadouts.map(loadout => (
                    <li class="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                      <div class="w-0 flex-1 flex items-center">
                        <span class="ml-2 flex-1 w-0 truncate">
                          {loadout.loadoutType === 0 ? "Head" : 
                           loadout.loadoutType === 1 ? "Upper Body" : 
                           loadout.loadoutType === 2 ? "Lower Body" : 
                           "Accessories"}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}