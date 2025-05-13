import { getTemplateRosters, getRosterWithPlayers } from "~/lib/roster";
import { json } from "@solidjs/router";

export const GET = async () => {
  try {
    const templates = await getTemplateRosters();
    const data = await Promise.all(
      templates.map(roster => getRosterWithPlayers(roster.rosterId))
    );
    return json(data);
  } catch (error) {
    console.error("API Error:", error);
    return json({ error: "Failed to load rosters" }, { status: 500 });
  }
}