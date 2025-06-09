import { createAsync, type RouteDefinition, A, useSubmission, useSubmissions } from "@solidjs/router";
import { getTemplateRosters, getRosters, getMyRosters, deleteRosterAction, renameRosterAction } from "~/lib/roster";
import { getUser } from "~/lib/login";
import { For, Show } from "solid-js";

export const route = {
  load() { getTemplateRosters(), getUser(); getMyRosters(); },
} satisfies RouteDefinition;

export default function RosterTemplates() {
  const user = createAsync(() => getUser(), { deferStream: true });
  
  const myRoster = createAsync(() => getMyRosters(), { deferStream: true });
  const deletingRoster = useSubmissions(deleteRosterAction);
  const renamingRoster = useSubmission(renameRosterAction);
  
  const filteredRosters = () =>
    myRoster()?.filter((roster) => {
      return !deletingRoster.some((d) => 
        d.input[0] === roster.rosterId
      );
    }) ?? [];

  return ( 
    <main class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div class="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-slate-800 mb-2">My Rosters</h1>
          <div class="flex items-center gap-4 text-slate-600">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 font-medium">
              {filteredRosters().length} {filteredRosters().length === 1 ? 'roster' : 'rosters'}
            </span>
          </div>
        </div>

        {/* Empty State */}
        <Show when={filteredRosters().length === 0}>
          <div class="text-center py-12">
            <div class="text-6xl mb-4">📋</div>
            <h3 class="text-xl font-semibold text-slate-700 mb-2">No rosters yet</h3>
            <p class="text-slate-500 mb-6">Create your first roster from a template to get started</p>
            <A 
              href="/rostersTemplates" 
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Browse Templates
            </A>
          </div>
        </Show>

        {/* Rosters Grid */}
        <Show when={filteredRosters().length > 0}>
          <div class="grid gap-4">
            <For each={filteredRosters()}>
              {(roster) => (
                <div class="bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
                  <div class="p-6">
                    <div class="flex items-start justify-between">
                      {/* Roster Info */}
                      <div class="flex-1 min-w-0">
                        <A 
                          href={`/rosters/${roster.rosterId}`} 
                          class="group block"
                        >
                          <h3 class="text-xl font-semibold text-slate-800 group-hover:text-blue-600 transition-colors mb-2 truncate">
                            {roster.name ?? "Untitled Roster"}
                          </h3>
                          <div class="flex items-center gap-4 text-sm text-slate-500">
                            <span class="flex items-center gap-1">
                              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                              </svg>
                              {roster?.players.length ?? 0} players
                            </span>
                            <Show when={roster.user?.username}>
                              <span>Created by {roster.user?.username}</span>
                            </Show>
                          </div>
                        </A>
                      </div>

                      {/* Action Buttons */}
                      <div class="flex items-center gap-2 ml-4">
                        {/* Download Button */}
                        <a 
                          href={`/api/download/${roster.rosterId}`}
                          download={`${roster.name ?? 'roster'}-${roster.rosterId}.json`}
                          class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                        >
                          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                          Download JSON
                        </a>

                        {/* Rename Form - SSR/No-JS Compatible */}
                        <details class="relative">
                          <summary class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 cursor-pointer list-none">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                            Rename
                          </summary>
                          <div class="absolute top-full left-0 mt-1 p-3 bg-white border border-slate-200 rounded-md shadow-lg z-10 min-w-64">
                            <form action={renameRosterAction} method="post">
                              <input type="hidden" name="rosterId" value={roster.rosterId} />
                              <div class="mb-3">
                                <label for={`name-${roster.rosterId}`} class="block text-sm font-medium text-slate-700 mb-1">
                                  New name:
                                </label>
                                <input 
                                  type="text" 
                                  id={`name-${roster.rosterId}`}
                                  name="name" 
                                  value={roster.name ?? ""}
                                  required
                                  class="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                              <div class="flex gap-2">
                                <button 
                                  type="submit"
                                  class="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                                >
                                  Save
                                </button>
                                <button 
                                  type="button"
                                  onclick={(e) => e.currentTarget.closest('details')?.removeAttribute('open')}
                                  class="px-3 py-1.5 bg-slate-200 text-slate-700 text-sm rounded-md hover:bg-slate-300 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </div>
                        </details>

                        {/* Delete Form */}
                        <details class="relative">
                          <summary class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 cursor-pointer list-none">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                            Delete
                          </summary>
                          <div class="absolute top-full right-0 mt-1 p-3 bg-white border border-slate-200 rounded-md shadow-lg z-10 min-w-64">
                            <div class="mb-3">
                              <h4 class="font-medium text-slate-900 mb-1">Delete Roster</h4>
                              <p class="text-sm text-slate-600">Are you sure? This action cannot be undone.</p>
                            </div>
                            <form action={deleteRosterAction.with(roster.rosterId)} method="post">
                              <input type="hidden" name="rosterId" value={roster.rosterId} />
                              <div class="flex gap-2">
                                <button 
                                  type="submit"
                                  class="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                                >
                                  Delete
                                </button>
                                <button 
                                  type="button"
                                  onclick={(e) => e.currentTarget.closest('details')?.removeAttribute('open')}
                                  class="px-3 py-1.5 bg-slate-200 text-slate-700 text-sm rounded-md hover:bg-slate-300 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </div>
                        </details>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>

        {/* Loading States */}
        <Show when={deletingRoster.some(sub => sub.pending) || renamingRoster.pending}>
          <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="flex items-center gap-3">
              <div class="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
              <div class="text-blue-700">
                <Show when={renamingRoster.pending}>
                  <span class="font-medium">Renaming roster...</span>
                </Show>
                <Show when={deletingRoster.some(sub => sub.pending)}>
                  <span class="font-medium">Deleting roster...</span>
                </Show>
              </div>
            </div>
          </div>
        </Show>

        {/* Quick Actions */}
        <div class="mt-8 pt-6 border-t border-slate-200">
          <div class="flex flex-wrap gap-3">
            <A 
              href="/rostersTemplate" 
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Create New Roster
            </A>

          </div>
        </div>
      </div>
    </main>
  );
}