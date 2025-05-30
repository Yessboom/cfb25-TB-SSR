import { createMiddleware } from "@solidjs/start/middleware";

const TRUSTED_ORIGINS = [
  "http://localhost:3000", 
  "http://localhost:5173", 
  "http://localhost:8081"
];

export default createMiddleware({
  onBeforeResponse: (event) => {
    const { request, response } = event;

    response.headers.append("Vary", "Origin, Access-Control-Request-Method");

    const origin = request.headers.get("Origin");
    const requestUrl = new URL(request.url);
    const isApiRequest = requestUrl && requestUrl.pathname.startsWith("/api");

    if (isApiRequest && origin && TRUSTED_ORIGINS.includes(origin)) {
      // Handle preflight requests
      if (
        request.method === "OPTIONS" &&
        request.headers.get("Access-Control-Request-Method")
      ) {
        // Return preflight response with all necessary headers
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS", 
            "Access-Control-Allow-Headers": "Authorization, Content-Type",
            "Access-Control-Allow-Credentials": "true", // For cookies/session
            "Access-Control-Max-Age": "86400" // Cache preflight for 24 hours
          },
        });
      }

      // Handle normal requests - add credentials support
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Credentials", "true"); // Added this
    }
  },
});