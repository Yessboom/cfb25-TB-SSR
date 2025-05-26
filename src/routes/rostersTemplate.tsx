import { createAsync, type RouteDefinition, A, useSubmissions } from "@solidjs/router";
import { getTemplateRosters, createRosterFromTemplateAction } from "~/lib/roster";
import { getUser } from "~/lib/login";
import { For, Show } from "solid-js";

export const route = {
  load() { getTemplateRosters(), getUser(); },
} satisfies RouteDefinition;



export default function RosterTemplates() {
  const user = createAsync(() => getUser(), { deferStream: true });
  const templates = createAsync(() => getTemplateRosters(), { deferStream: true });
  const creatingRoster = useSubmissions(createRosterFromTemplateAction);

  return ( 
    <main class="w-full p-4 space-y-6">
      <h1 class="text-3xl font-bold">Roster Templates</h1>

      {/* Show a count */}
      <p class="text-gray-600">Found {templates()?.length ?? 0} templates</p>

      {/* Create roster form - only show if user is logged in */}
      <Show when={user()}>
        <div class="bg-gray-50 p-4 rounded-lg">
          <h2 class="text-xl font-semibold mb-3">Create New Roster from Template</h2>
          <form action={createRosterFromTemplateAction} method="post" class="space-y-3">
            <div>
              <label for="templateId" class="block text-sm font-medium text-gray-700 mb-1">
                Select Template:
              </label>
              <select 
                name="templateId" 
                id="templateId"
                required
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a template...</option>
                <For each={templates()}>
                  {(template) => (
                    <option value={template.rosterId}>
                      {template.name ?? "(no name)"} — {template.players.length} players
                    </option>
                  )}
                </For>
              </select>
            </div>
            
            <div>
              <label for="rosterName" class="block text-sm font-medium text-gray-700 mb-1">
                New Roster Name:
              </label>
              <input 
                type="text" 
                name="rosterName" 
                id="rosterName"
                placeholder="Enter name for your new roster"
                required
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <button 
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Roster
            </button>
          </form>
        </div>
      </Show>

      {/* Show pending roster creations - this will work in SSR */}
      <Show when={creatingRoster.length > 0}>
        <div class="bg-blue-50 p-4 rounded-lg">
          <h3 class="text-lg font-medium text-blue-800 mb-2">Creating Rosters...</h3>
          <For each={creatingRoster}>
            {(submission) => (
              <Show when={submission.pending}>
                <div class="flex items-center space-x-2 text-blue-700">
                  <div class="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  <span>Creating "{String(submission.input[0].get("rosterName"))}" from template...</span>
                </div>
              </Show>
            )}
          </For>
        </div>
      </Show>

      {/* Template list */}
      <div class="space-y-4">
        <h2 class="text-2xl font-semibold">Available Templates</h2>
        <Show 
          when={templates()?.length} 
          fallback={<p class="text-gray-500">No templates available.</p>}
        >
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <For each={templates()}>
              {(template) => (
                <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 class="text-lg font-medium mb-2">
                    <A href={`/rosters/${template.rosterId}`} class="text-blue-600 hover:underline">
                      {template.name ?? "(no name)"}
                    </A>
                  </h3>
                  <div class="text-sm text-gray-600 space-y-1">
                    <p>{template.players.length} players</p>
                    <Show when={template.user?.username}>
                      <p>Created by: {template.user!.username}</p>
                    </Show>
                  </div>
                  <div class="mt-3 flex space-x-2">
                    <A 
                      href={`/rosters/${template.rosterId}`}
                      class="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      View Details
                    </A>
                    <Show when={user()}>
                      {/* No-JS compatible: Use a separate form for each template */}
                      <form action={createRosterFromTemplateAction} method="post" class="inline">
                        <input type="hidden" name="templateId" value={template.rosterId} />
                        <input 
                          type="text" 
                          name="rosterName" 
                          placeholder={`Copy of ${template.name ?? 'Template'}`}
                          required
                          class="text-xs px-2 py-1 border border-gray-300 rounded mr-1 w-32"
                        />
                        <button
                          type="submit"
                          class="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        >
                          Create Copy
                        </button>
                      </form>
                    </Show>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>

      {/* Login prompt for non-authenticated users */}
      <Show when={!user()}>
        <div class="bg-yellow-50 p-4 rounded-lg">
          <p class="text-yellow-800">
            <A href="/login" class="font-medium underline">Log in</A> to create your own rosters from these templates.
          </p>
        </div>
      </Show>
    </main>
  );
}