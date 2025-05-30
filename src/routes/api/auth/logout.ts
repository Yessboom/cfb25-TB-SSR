import type { APIEvent } from "@solidjs/start/server";
import { logout } from "~/lib/server";

export const POST = async (event: APIEvent) => {
  try {
    await logout();
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: "Logged out successfully" 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: "Logout failed" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};