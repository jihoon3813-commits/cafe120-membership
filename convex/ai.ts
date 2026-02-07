import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// History Management
export const saveHistory = mutation({
    args: {
        userId: v.string(),
        type: v.string(), // 'sns', 'image', 'tax', 'labor'
        input: v.string(),
        output: v.string(),
    },
    handler: async (ctx, args) => {
        const { userId, type, input, output } = args;
        await ctx.db.insert("ai_history", {
            userId,
            type,
            input,
            output,
            createdAt: new Date().toISOString(),
        });
    },
});

export const getMyHistory = query({
    args: {
        userId: v.string(),
        type: v.optional(v.string()), // Optional filter by type
    },
    handler: async (ctx, args) => {
        const { userId, type } = args;
        // This is a simple implementation. 
        // For production with many users, verify logic is needed to ensure userId matches auth.
        // Assuming the frontend passes the correct logged-in userId for now as per "simple" scope.

        let logs = await ctx.db
            .query("ai_history")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .order("desc") // creating index handles order? No, default is insertion order mostly or need timestamp index.
            // Schema only indexed by userId. Sorting in memory for now (limit 50).
            .collect();

        if (type) {
            logs = logs.filter(log => log.type === type);
        }

        // Sort by createdAt desc in memory
        return logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
});

export const getMyHistoryByType = query({
    args: {
        userId: v.string(),
        type: v.string(),
    },
    handler: async (ctx, args) => {
        const { userId, type } = args;
        const logs = await ctx.db
            .query("ai_history")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) => q.eq(q.field("type"), type))
            .collect();

        return logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
});
