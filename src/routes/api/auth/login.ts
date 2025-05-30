import type { APIEvent } from "@solidjs/start/server";
import { login, validateUsername, validatePassword, getSession } from "~/lib/server";

export const POST = async (event: APIEvent) => {
  try {
    const body = await event.request.json();
    const { username, password } = body;
    
    // Validate input
    const error = validateUsername(username) || validatePassword(password);
    if (error) {
      return new Response(JSON.stringify({ error }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const user = await login(username, password);

    //Update the session
    const session = await getSession();
    await session.update(d => ({
      userId: user.userId
    }));
    
    return new Response(JSON.stringify({ 
      success: true, 
      user: { id: user.userId, username: user.username } 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Login failed" 
    }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
};