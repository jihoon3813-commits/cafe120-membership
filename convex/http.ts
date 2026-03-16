import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  pathPrefix: "/api/storage/",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const { pathname, searchParams } = new URL(request.url);
    
    // Try to get storageId from path (if it's /api/storage/ID)
    let storageId = pathname.split("/api/storage/")[1];
    
    // Fallback to query param if not in path
    if (!storageId) {
      storageId = searchParams.get("storageId");
    }

    if (!storageId) {
      return new Response("Missing storageId", { 
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    const blob = await ctx.storage.get(storageId);
    if (!blob) {
      return new Response("File not found", { 
        status: 404,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Type": blob.type || "video/mp4",
        "Cache-Control": "public, max-age=31536000",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }),
});

// Options request for CORS
http.route({
  pathPrefix: "/api/storage/",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }),
});

export default http;
