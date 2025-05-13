import { createAsync, type RouteDefinition } from "@solidjs/router";
import { getTemplateRosters } from "~/lib/roster";
import { getUser } from "~/lib/login";

export const route = {
  preload() { getTemplateRosters(), getUser() }
} satisfies RouteDefinition;

export default function Home() {
  const user = createAsync(() => getUser(), { deferStream: true });
  
  const templates = createAsync(() => getTemplateRosters(), { deferStream: true });

  return ( 
    <main class="w-full p-4 space-y-4">
      <h1 class="text-3xl font-bold">Roster Templates</h1>

      {/* show a count */}
      <p>Found {templates()?.length ?? 0} templates</p>

      {/* render each template */}
      <ul class="list-disc pl-5">
        {templates()?.map(tpl => (
          <li>
            <a href={`/rosters/${tpl.rosterId}`} class="text-blue-600 hover:underline">
              {tpl.name ?? "(no name)"} — {tpl?.players.length ?? 0} players
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
