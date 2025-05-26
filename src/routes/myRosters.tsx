import { createAsync, type RouteDefinition, A } from "@solidjs/router";
import { getTemplateRosters, getRosters, getMyRosters } from "~/lib/roster";
import { getUser } from "~/lib/login";
import { c } from "vinxi/dist/types/lib/logger";


export const route = {
  load() { getTemplateRosters(), getUser(); getMyRosters(); },
} satisfies RouteDefinition;

export default function RosterTemplates() {
  const user = createAsync(() => getUser(), { deferStream: true });
  
  const myRoster = createAsync(() => getMyRosters(), { deferStream: true });

  return ( 
    <main class="w-full p-4 space-y-4">
      <h1 class="text-3xl font-bold">Roster Templates</h1>

      {/* show a count */}
      <p>Found {myRoster()?.length ?? 0} templates</p>

      {/* render each template */}
      <ul class="list-disc pl-5">
        {myRoster()?.map(tpl => (
          <li>
            <A href={`/rosters/${tpl.rosterId}`} class="text-blue-600 hover:underline">
              {tpl.name ?? "(no name)"} — {tpl?.players.length ?? 0} players
            </A>
          </li>
        ))}
      </ul>
    </main>
  );
}
