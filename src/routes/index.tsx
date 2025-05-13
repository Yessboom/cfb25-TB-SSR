
import { Show } from "solid-js";
import { createAsync } from "@solidjs/router";
import { getUser, logout } from "~/lib/login";
import { A } from "@solidjs/router";


export default function Home() {
  const user = createAsync(() => getUser().catch(() => null), { deferStream: true });

  return (
    <main class="w-full p-4 space-y-6">
      <h1 class="text-4xl font-bold">Welcome to Team Roster App</h1>
      
      <Show when={user()} fallback={
        <div class="bg-blue-50 p-6 rounded-lg shadow-sm">
          <h2 class="text-2xl font-semibold mb-4">Get Started</h2>
          <p class="mb-4">Please log in to access your team rosters.</p>
          <A 
            href="/login" 
            class="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Log In / Register
          </A>
        </div>
      }>
        <div class="bg-green-50 p-6 rounded-lg shadow-sm">
          <h2 class="text-2xl font-semibold mb-4">Welcome back, {user()?.username}!</h2>
          <p class="mb-4">What would you like to do today?</p>
          
          <div class="flex flex-wrap gap-4">
            <A 
              href="/rostersTemplate" 
              class="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Browse Roster Templates
            </A>
          </div>
          <form action={logout} method="post">
        <button name="logout" type="submit">
          Logout
        </button>
      </form>
        </div>
      </Show>
    </main>
  );
}