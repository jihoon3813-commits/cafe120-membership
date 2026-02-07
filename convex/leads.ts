import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Submit a new lead
export const submit = mutation({
    args: {
        productId: v.string(),
        productName: v.string(),
        name: v.string(),
        phone: v.string(),
        email: v.optional(v.string()),
        businessName: v.optional(v.string()),
        message: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("leads", {
            ...args,
            status: "pending",
            createdAt: new Date().toISOString(),
        });
    },
});

// Get all leads (for admin)
export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("leads").order("desc").collect();
    },
});
