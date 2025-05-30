import type { APIEvent } from "@solidjs/start/server";
import { getSession } from "~/lib/server";
import { db } from "~/lib/db";

export const GET = async (event: APIEvent) => {
  try {
    const session = await getSession();
    const userId = session.data.userId;
    
    if (!userId) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const user = await db.user.findUnique({ 
      where: { userId },
      select: { userId: true, username: true }
    });
    
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      user: { id: user.userId, username: user.username } 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: "Failed to get user info" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};