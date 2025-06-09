import { Switch, Match, createMemo, Accessor } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import { Player } from "~/types";
import { getPositionName } from "../utils/utils";
import { createEffect, Show } from "solid-js";
import EditableSkillInput from "./EditableSkillInput";
import { updatePlayerSkill } from "~/lib/player";

const skillCategories = {
  physical: { name: "Physical", skills: ["speed", "acceleration", "strength", "agility", "jumping", "stamina", "toughness", "injury", "awareness"] },
  passing: { name: "Passing", skills: ["throwPower", "throwAccuracy", "throwAccuracyShort", "throwAccuracyMid", "throwAccuracyDeep", "playAction", "throwOnTheRun", "throwUnderPressure", "breakSack"] },
  rushing: { name: "Rushing", skills: ["carrying", "trucking", "backfieldVision", "stiffArm", "spinMove", "jukeMove", "breakTackle", "changeOfDirection"] },
  receiving: { name: "Receiving", skills: ["catching", "spectacularCatch", "catchInTraffic", "shortRouteRun", "mediumRouteRun", "deepRouteRun", "release"] },
  blocking: { name: "Blocking", skills: ["runBlock", "passBlock", "impactBlocking", "runBlockPower", "runBlockFinesse", "passBlockPower", "passBlockFinesse", "leadBlock"] },
  defense: { name: "Defense", skills: ["tackle", "hitPower", "powerMoves", "finesseMoves", "blockShedding", "pursuit", "playRecognition"] },
  coverage: { name: "Coverage", skills: ["manCoverage", "zoneCoverage", "playRecognition", "press"] },
  kicking: { name: "Kicking", skills: ["kickPower", "kickAccuracy", "kickReturn", "longSnapRating"] }
};


export default function PlayerSkillTabs({ player }: { player: Accessor<Player | null> }) {
  const location = useLocation();
  const activeTab = createMemo(() => {
    const search = location.search; 
    return new URLSearchParams(search).get("tab") ?? "physical";
  });
  
  const getSkillValue = (player: any, skillName: string): number | null =>
    player[skillName] !== undefined && player[skillName] !== null ? player[skillName] : null;

  const formatSkillName = (skillName: string) =>
    skillName.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase()).trim();

  return (
    <>
      {/* Tabs Navigation */}
      <nav class="flex space-x-8 px-4 sm:px-6 overflow-x-auto" aria-label="Tabs">
        {Object.keys(skillCategories).map((categoryKey) => {
          const category = skillCategories[categoryKey as keyof typeof skillCategories];
          const newParams = new URLSearchParams(location.search);
          newParams.set("tab", categoryKey);

          return (
            <A
              href={`?${newParams.toString()}`}
              class={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab() === categoryKey
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {category.name}
            </A>
          );
        })}
      </nav>

      {/* Tab Content - Wrap in Show to handle null player */}
      <div class="px-4 py-5 sm:px-6">
        <Show when={player()}>
          {(currentPlayer) => (
            <Switch>
              {Object.keys(skillCategories).map((categoryKey) => {
                const category = skillCategories[categoryKey as keyof typeof skillCategories];
                return (
                  <Match when={activeTab() === categoryKey}>
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {category.skills.map((skillName) => {
                        const skillValue = getSkillValue(currentPlayer(), skillName);
                        return (
                          skillValue !== null && (
                            <EditableSkillInput
                              value={skillValue}
                              playerId={currentPlayer().id}
                              skillName={skillName}
                              updateAction={updatePlayerSkill}
                              formatSkillName={formatSkillName}
                            />
                          )
                        );
                      })}
                    </div>
                  </Match>
                );
              })}
            </Switch>
          )}
        </Show>
      </div>
    </>
  );
}