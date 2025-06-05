import { createMiddleware } from "@solidjs/start/middleware";

const TRUSTED_ORIGINS = ["http://localhost:8081"];

export default createMiddleware({
  onRequest: (event) => {
    const { request } = event;
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
    
    // This should appear in your server console if middleware is working
    console.log("🔥🔥🔥 MIDDLEWARE IS RUNNING!", request.method, url.pathname, "Origin:", origin);
    
    event.locals.startTime = Date.now();

    // Handle preflight requests in onRequest to intercept them early
    if (request.method === "OPTIONS" && url.pathname.startsWith("/api") && origin && TRUSTED_ORIGINS.includes(origin)) {
      console.log("🎯 INTERCEPTING PREFLIGHT REQUEST");
      
      const allowHeaders = "Authorization, Content-Type";
      const allowMethods = "OPTIONS, GET, POST, PUT, PATCH, DELETE";
      
      // Return the preflight response immediately
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": allowMethods,
          "Access-Control-Allow-Headers": allowHeaders,
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Max-Age": "86400",
          "Vary": "Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
        }
      });
    }
  },

  onBeforeResponse: (event) => {
    const { request, response } = event;
    const origin = request.headers.get("Origin");
    const url = new URL(request.url);

    console.log("🔥🔥🔥 MIDDLEWARE RESPONSE HANDLER!", request.method, url.pathname, "Origin:", origin);

    const isApiRequest = url.pathname.startsWith("/api");

    // Set CORS headers for actual API requests (not OPTIONS)
    if (isApiRequest && origin && TRUSTED_ORIGINS.includes(origin) && request.method !== "OPTIONS") {
      console.log("🎯 SETTING CORS HEADERS FOR ACTUAL REQUEST");
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Credentials", "true");
      response.headers.set("Access-Control-Expose-Headers", "Content-Type, Authorization");
    }

    // Log duration
    if (event.locals.startTime) {
      const duration = Date.now() - event.locals.startTime;
      console.log(`Request duration: ${duration}ms`);
    }
  },
});