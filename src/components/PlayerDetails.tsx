import { Show, For, createEffect, createSignal, createMemo } from "solid-js";
import { Player } from "~/types";
import { getPositionName, formatHeight, formatWeight } from "../utils/utils";
import { Accessor, Switch, Match} from "solid-js";
import { useLocation, A } from "@solidjs/router";
import PlayerSkillTabs from "./PlayerSkillTabs";


  

export default function PlayerDetails({ player }: { player: Accessor<Player | null> }) {
const location = useLocation();
const activeTab = createMemo(() => new URLSearchParams(location.search).get("tab") ?? "physical");
  // Debug: Log when player changes
  createEffect(() => {
    console.log("PlayerDetails received player:", player);
  });

  const getSkillValue = (player: any, skillName: string): number | null => {
    return player[skillName] !== undefined && player[skillName] !== null ? player[skillName] : null;
  };

  

  const formatSkillName = (skillName: string): string => {
    // Convert camelCase to readable format
    return skillName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  return (
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <Show when={player()} fallback={<p class="p-4 text-gray-500">Select a player to view details</p>}>
        {(selectedPlayer) => {
          console.log("Rendering selected player:", selectedPlayer());
          
          return (
            <>
              {/* Player Header */}
              <div class="px-4 py-5 sm:px-6 bg-gray-50">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  {selectedPlayer().firstName} {selectedPlayer().lastName}
                </h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">
                  #{selectedPlayer().jerseyNumber} • {getPositionName(selectedPlayer().position)}
                </p>
              </div>

              {/* Basic Info */}
              <div class="border-t border-gray-200">
                <dl>
                  <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Overall Rating</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <span class={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                        selectedPlayer().overallRating >= 85 ? "bg-green-100 text-green-800" :
                        selectedPlayer().overallRating >= 75 ? "bg-blue-100 text-blue-800" :
                        selectedPlayer().overallRating >= 65 ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {selectedPlayer().overallRating}
                      </span>
                    </dd>
                  </div>
                  <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Age</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{selectedPlayer().age}</dd>
                  </div>
                  <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Position</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{getPositionName(selectedPlayer().position)}</dd>
                  </div>
                  <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Height</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatHeight(selectedPlayer().height)}</dd>
                  </div>
                  <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Weight</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatWeight(selectedPlayer().weightPounds)}</dd>
                  </div>
                  <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Potential</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <span class={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                        selectedPlayer().potential >= 85 ? "bg-green-100 text-green-800" :
                        selectedPlayer().potential >= 75 ? "bg-blue-100 text-blue-800" :
                        selectedPlayer().potential >= 65 ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {selectedPlayer().potential}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

            <div class="border-t border-gray-200">
              <PlayerSkillTabs player={selectedPlayer()} />
            </div>

              {/* Contract Info */}
              <Show when={selectedPlayer().contractYearsLeft > 0}>
                <div class="border-t border-gray-200 bg-gray-50 px-4 py-5 sm:px-6">
                  <h4 class="text-base font-medium text-gray-900 mb-3">Contract Details</h4>
                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span class="block font-medium text-gray-700">Years Left</span>
                      <span class="text-gray-900">{selectedPlayer().contractYearsLeft}</span>
                    </div>
                    <div>
                      <span class="block font-medium text-gray-700">Total Salary</span>
                      <span class="text-gray-900">${selectedPlayer().validTotalSalary?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Show>

              {/* Loadouts Section */}
              <Show when={selectedPlayer().loadouts && selectedPlayer().loadouts.length > 0}>
                <div class="border-t border-gray-200 bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Equipment</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <ul class="border border-gray-200 rounded-md divide-y divide-gray-200 bg-white">
                          {selectedPlayer().loadouts.map((loadout) => (
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
              </Show>
            </>
          );
        }}
      </Show>
    </div>
  );
}