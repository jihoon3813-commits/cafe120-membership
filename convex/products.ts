import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all products
export const list = query({
    args: {},
    handler: async (ctx) => {
        const products = await ctx.db.query("products").collect();
        return Promise.all(products.map(async (product) => ({
            ...product,
            image: product.storageId ? (await ctx.storage.getUrl(product.storageId)) || product.image : product.image
        })));
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
        storageId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("products", args);
    },
});

// Update product using internal _id
export const update = mutation({
    args: {
        id: v.id("products"),
        fieldsToUpdate: v.object({
            id: v.optional(v.string()), // Allow updating the custom ID string
            name: v.optional(v.string()),
            description: v.optional(v.string()),
            price: v.optional(v.string()),
            active: v.optional(v.boolean()),
            image: v.optional(v.string()),
            features: v.optional(v.array(v.string())),
            storageId: v.optional(v.string()),
            isPremium: v.optional(v.boolean()),
            commitment: v.optional(v.string()),
            installments: v.optional(v.string()),
            initial: v.optional(v.string()),
            color: v.optional(v.string()),
        }),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, args.fieldsToUpdate);
    },
});

export const remove = mutation({
    args: { id: v.id("products") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
