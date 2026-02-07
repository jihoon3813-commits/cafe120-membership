import { ConvexReactClient } from "convex/react";

const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl) {
    console.error("VITE_CONVEX_URL is not set. Please run `npx convex dev` and check your .env.local file.");
}

export const convex = new ConvexReactClient(convexUrl || "https://placeholder-url.convex.cloud");
