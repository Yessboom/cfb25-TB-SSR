import { Show, For, createEffect, createSignal, createMemo } from "solid-js";
import { Player } from "~/types";
import { getPositionName, formatHeight, formatWeight } from "../utils/utils";
import { Accessor, Switch, Match} from "solid-js";
import { useLocation, A } from "@solidjs/router";
import PlayerSkillTabs from "./PlayerSkillTabs";
import EditableInput from "./EditableInput";
import ImpactPlayerToggle from "./playerImpact";
import { updatePlayerBasicInfo } from "~/lib/player";
import { getOverall } from "~/utils/overallCalculator";
import { getPortraitImage } from "~/utils/portraitMapping";
import SliderInput from "./sliderInput";

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
          const overall = createMemo(() => getOverall(selectedPlayer()));

          return (
            <>
              {/* Player Header */}
              <div class="px-4 py-5 sm:px-6 bg-gray-50">
                <div class="flex items-start space-x-4">
                  {/* Player Portrait */}
                  <div class="flex-shrink-0">
                    <Show when={selectedPlayer().portraitImage} fallback={
                      <div class="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                        <svg class="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                        </svg>
                      </div>
                    }>
                      <img 
                        src={selectedPlayer().portraitImage!} 
                        alt={`${selectedPlayer().firstName} ${selectedPlayer().lastName}`}
                        class="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                        loading="lazy"
                        onError={(e) => {
                          // Hide image if it fails to load
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </Show>
                  </div>
                  
                  {/* Player Info */}
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <h3 class="text-lg leading-6 font-medium text-gray-900 space-x-2">
                        <EditableInput
                          value={selectedPlayer().firstName}
                          playerId={selectedPlayer().id}
                          field="firstName"
                          type="text"
                          updateAction={updatePlayerBasicInfo}
                          displayClass="font-medium"
                        />
                        <EditableInput
                          value={selectedPlayer().lastName}
                          playerId={selectedPlayer().id}
                          field="lastName"
                          type="text"
                          updateAction={updatePlayerBasicInfo}
                          displayClass="font-medium"
                        />
                      </h3>
                      {/* Impact Player Star */}
                      <ImpactPlayerToggle 
                        playerId={selectedPlayer().id}
                        isImpactPlayer={selectedPlayer().isImpactPlayer || false}
                      />
                    </div>
                    <p class="mt-1 max-w-2xl text-sm text-gray-500">
                      #<EditableInput
                        value={selectedPlayer().jerseyNumber}
                        playerId={selectedPlayer().id}
                        field="jerseyNumber"
                        type="number"
                        min={1}
                        max={99}
                        updateAction={updatePlayerBasicInfo}
                        displayClass="inline"
                      /> • {getPositionName(selectedPlayer().position)}
                      {selectedPlayer().isImpactPlayer && (
                        <span class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          Impact Player
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div class="border-t border-gray-200">
                <dl>
                  <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Overall Rating</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <span class={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                        overall() >= 85 ? "bg-green-100 text-green-800" :
                        overall() >= 75 ? "bg-blue-100 text-blue-800" :
                        overall() >= 65 ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {overall()}
                      </span>
                    </dd>
                  </div>
                  <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Age</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <EditableInput
                        value={selectedPlayer().age}
                        playerId={selectedPlayer().id}
                        field="age"
                        type="number"
                        min={18}
                        max={45}
                        updateAction={updatePlayerBasicInfo}
                      />
                    </dd>
                  </div>
                  <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Position</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{getPositionName(selectedPlayer().position)}</dd>
                  </div>
                  
                  {/* Height Slider */}
                  <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Height</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <SliderInput
                        value={selectedPlayer().height}
                        playerId={selectedPlayer().id}
                        field="height"
                        min={60}
                        max={84}
                        formatter={(value) => formatHeight(value)}
                        label="Height"
                      />
                    </dd>
                  </div>
                  
                  {/* Weight Slider */}
                  <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Weight</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <SliderInput
                        value={selectedPlayer().weightPounds}
                        playerId={selectedPlayer().id}
                        field="weightPounds"
                        min={150}
                        max={400}
                        step={5}
                        formatter={(value) => formatWeight(value)}
                        label="Weight"
                      />
                    </dd>
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
                <PlayerSkillTabs player={selectedPlayer} />
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