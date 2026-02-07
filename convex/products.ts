import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all products
export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("products").collect();
    },
});

// Create product (for admin or initial seed)
export const create = mutation({
    args: {
        id: v.string(), // e.g. 'egg120'
        name: v.string(),
        description: v.string(),
        features: v.array(v.string()),
        commitment: v.optional(v.string()),
        price: v.string(),
        installments: v.string(),
        initial: v.string(),
        image: v.string(),
        color: v.string(),
        isPremium: v.boolean(),
        active: v.boolean(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("products", args);
    },
});

// Update product
export const update = mutation({
    args: {
        id: v.string(),
        fieldsToUpdate: v.object({
            name: v.optional(v.string()),
            description: v.optional(v.string()),
            price: v.optional(v.string()),
            active: v.optional(v.boolean()),
            image: v.optional(v.string()),
            features: v.optional(v.array(v.string())),
        }),
    },
    handler: async (ctx, args) => {
        const existingProduct = await ctx.db
            .query("products")
            .withIndex("by_product_id", (q) => q.eq("id", args.id))
            .first();

        if (!existingProduct) {
            throw new Error("Product not found");
        }

        await ctx.db.patch(existingProduct._id, args.fieldsToUpdate);
    },
});
