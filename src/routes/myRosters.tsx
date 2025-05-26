import { createAsync, type RouteDefinition, A, useSubmission, useSubmissions } from "@solidjs/router";
import { getTemplateRosters, getRosters, getMyRosters, deleteRosterAction } from "~/lib/roster";
import { getUser } from "~/lib/login";
import { For, Show } from "solid-js";


export const route = {
  load() { getTemplateRosters(), getUser(); getMyRosters(); },
} satisfies RouteDefinition;

export default function RosterTemplates() {
  const user = createAsync(() => getUser(), { deferStream: true });
  
  const myRoster = createAsync(() => getMyRosters(), { deferStream: true });
  const deletingRoster = useSubmissions(deleteRosterAction);
    const filteredRosters = () =>
    myRoster()?.filter((roster) => {
      return !deletingRoster.some((d) => 
        d.input[0] === roster.rosterId
      );
    }) ?? [];

  return ( 
    <main class="w-full p-4 space-y-4">
      <h1 class="text-3xl font-bold">My Rosters</h1>

      {/* show a count */}
      <p>Found {filteredRosters().length} rosters</p>

      {/* render each roster */}
      <ul class="list-disc pl-5 space-y-2">
        <For each={filteredRosters()}>
          {(roster) => (
            <li class="flex items-center justify-between">
              <div>
                <A href={`/rosters/${roster.rosterId}`} class="text-blue-600 hover:underline">
                  {roster.name ?? "(no name)"} — {roster?.players.length ?? 0} players
                </A>
              </div>
              <form action={deleteRosterAction.with(roster.rosterId)} method="post" class="inline ml-2">
                <input type="hidden" name="rosterId" value={roster.rosterId} />
                <button 
                  type="submit" 
                  class="text-red-600 hover:underline px-2 py-1 text-sm"
                  onClick={(e) => {
                    if (!confirm("Are you sure you want to delete this roster?")) {
                      e.preventDefault();
                    }
                  }}
                >
                  Delete
                </button>
              </form>
            </li>
          )}
        </For>
        
        {/* Show pending deletions */}
        <For each={deletingRoster}>
          {(sub) => (
            <Show when={sub.pending}>
              <li class="text-gray-500 italic">
                Deleting roster... (pending)
              </li>
            </Show>
          )}
        </For>
      </ul>
    </main>
  );
}