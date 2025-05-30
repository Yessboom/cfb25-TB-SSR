import type { APIEvent } from "@solidjs/start/server";
import { register, validateUsername, validatePassword, getSession } from "~/lib/server";

export const POST = async (event: APIEvent) => {
  try {
    const body = await event.request.json();
    const { username, password } = body;
    
    const error = validateUsername(username) || validatePassword(password);
    if (error) {
      return new Response(JSON.stringify({ error }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const user = await register(username, password);
    
    // Update session
    const session = await getSession();
    await session.update(() => ({ userId: user.userId }));
    
    return new Response(JSON.stringify({ 
      success: true, 
      user: { id: user.userId, username: user.username } 
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Registration failed" 
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
};