import { Switch, Match, createMemo } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import { Player } from "~/types";
import { getPositionName } from "../utils/utils";

const skillCategories = {
  physical: { name: "Physical", skills: ["speed", "acceleration", "strength", "agility", "jumping", "stamina", "toughness", "injury", "awareness"] },
  passing: { name: "Passing", skills: ["throwPower", "throwAccuracy", "throwAccuracyShort", "throwAccuracyMid", "throwAccuracyDeep", "playAction", "throwOnTheRun", "throwUnderPressure", "breakSack"] },
  rushing: { name: "Rushing", skills: ["carrying", "trucking", "backfieldVision", "stiffArm", "spinMove", "jukeMove", "breakTackle", "changeOfDirection"] },
  receiving: { name: "Receiving", skills: ["catching", "spectacularCatch", "catchInTraffic", "shortRouteRun", "mediumRouteRun", "deepRouteRun", "kickReturn"] },
  blocking: { name: "Blocking", skills: ["runBlock", "passBlock", "impactBlocking", "runBlockPower", "runBlockFinesse", "passBlockPower", "passBlockFinesse", "leadBlock"] },
  defense: { name: "Defense", skills: ["tackle", "hitPower", "powerMoves", "finesseMoves", "blockShedding", "pursuit", "playRecognition", "awareness"] },
  coverage: { name: "Coverage", skills: ["manCoverage", "zoneCoverage", "playRecognition", ] },
  kicking: { name: "Kicking", skills: ["kickPower", "kickAccuracy", "longSnapRating"] }
};

export default function PlayerSkillTabs({ player }: { player: Player }) {
  const location = useLocation();
  const activeTab = createMemo(() => new URLSearchParams(location.search).get("tab") ?? "physical");

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

      {/* Tab Content */}
      <div class="px-4 py-5 sm:px-6">
        <Switch>
          {Object.keys(skillCategories).map((categoryKey) => {
            const category = skillCategories[categoryKey as keyof typeof skillCategories];
            return (
              <Match when={activeTab() === categoryKey}>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {category.skills.map((skillName) => {
                    const skillValue = getSkillValue(player, skillName);
                    return (
                      skillValue !== null && skillValue !== 0 && (
                        <div class="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                          <div class="flex justify-between items-center mb-2">
                            <span class="text-sm font-medium text-gray-700">{formatSkillName(skillName)}</span>
                            <span class={`text-lg font-bold ${
                              skillValue >= 85 ? "text-green-600" :
                              skillValue >= 75 ? "text-blue-600" :
                              skillValue >= 65 ? "text-yellow-600" :
                              "text-red-600"
                            }`}>{skillValue}</span>
                          </div>
                          <div class="w-full bg-gray-200 rounded-full h-2">
                            <div
                              class={`h-2 rounded-full ${
                                skillValue >= 85 ? "bg-green-500" :
                                skillValue >= 75 ? "bg-blue-500" :
                                skillValue >= 65 ? "bg-yellow-500" :
                                "bg-red-500"
                              }`}
                              style={{ width: `${Math.min(skillValue, 100)}%` }}
                            />
                          </div>
                        </div>
                      )
                    );
                  })}
                </div>
              </Match>
            );
          })}
        </Switch>
      </div>
    </>
  );
}
