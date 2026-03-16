import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/api/storage",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const { searchParams } = new URL(request.url);
    const storageId = searchParams.get("storageId");
    if (!storageId) {
      return new Response("Missing storageId", { status: 400 });
    }
    const blob = await ctx.storage.get(storageId);
    if (!blob) {
      return new Response("File not found", { status: 404 });
    }
    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Type": blob.type,
        "Cache-Control": "public, max-age=31536000",
      },
    });
  }),
});

export default http;
