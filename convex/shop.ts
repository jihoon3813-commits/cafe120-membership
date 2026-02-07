import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getIngredients = query({
    args: { category: v.optional(v.string()) },
    handler: async (ctx, args) => {
        let items;
        if (args.category && args.category !== 'all') {
            items = await ctx.db
                .query("ingredients")
                .withIndex("by_category", (q) => q.eq("category", args.category!))
                .filter((q) => q.eq(q.field("active"), true))
                .collect();
        } else {
            items = await ctx.db
                .query("ingredients")
                .filter((q) => q.eq(q.field("active"), true))
                .collect();
        }
        // Client-side sort by 'order' (ascending)
        const sorted = items.sort((a, b) => (a.order || 0) - (b.order || 0));
        return Promise.all(sorted.map(async (item) => ({
            ...item,
            thumbnail: item.storageId ? (await ctx.storage.getUrl(item.storageId)) || item.thumbnail : item.thumbnail
        })));
    },
});

export const getAllIngredients = query({ // for admin
    handler: async (ctx) => {
        const items = await ctx.db.query("ingredients").collect();
        const sorted = items.sort((a, b) => (a.order || 0) - (b.order || 0));
        return Promise.all(sorted.map(async (item) => ({
            ...item,
            thumbnail: item.storageId ? (await ctx.storage.getUrl(item.storageId)) || item.thumbnail : item.thumbnail
        })));
    }
});


export const addIngredient = mutation({
    args: {
        category: v.string(),
        name: v.string(),
        price: v.number(),
        thumbnail: v.string(),
        detailImage: v.optional(v.string()),
        unit: v.string(),
        minQuantity: v.number(),
        shippingFee: v.number(),
        active: v.boolean(),
        order: v.optional(v.number()),
        storageId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // If storageId is provided but thumbnail is empty (or placeholder), we can generate url.
        // But for simplicity, we assume frontend provides a valid url or we use storageId.
        // Actually best practice is to store storageId, but current app uses url strings.
        // So we will just store args.
        const id = await ctx.db.insert("ingredients", { ...args, order: args.order ?? 9999 });
        return id;
    },
});

export const updateIngredient = mutation({
    args: {
        id: v.id("ingredients"),
        category: v.optional(v.string()),
        name: v.optional(v.string()),
        price: v.optional(v.number()),
        thumbnail: v.optional(v.string()),
        detailImage: v.optional(v.string()),
        unit: v.optional(v.string()),
        minQuantity: v.optional(v.number()),
        shippingFee: v.optional(v.number()),
        active: v.optional(v.boolean()),
        order: v.optional(v.number()),
        storageId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...fields } = args;
        await ctx.db.patch(id, fields);
        return { success: true };
    },
});

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const reorderIngredients = mutation({
    args: {
        updates: v.array(v.object({
            id: v.id("ingredients"),
            order: v.number(),
        })),
    },
    handler: async (ctx, args) => {
        for (const update of args.updates) {
            await ctx.db.patch(update.id, { order: update.order });
        }
    },
});

// CATEGORIES
export const getCategories = query({
    handler: async (ctx) => {
        const categories = await ctx.db.query("ingredient_categories").collect();
        return categories.sort((a, b) => a.order - b.order);
    },
});

export const addCategory = mutation({
    args: { name: v.string(), order: v.number() },
    handler: async (ctx, args) => {
        await ctx.db.insert("ingredient_categories", args);
    },
});

export const updateCategory = mutation({
    args: { id: v.id("ingredient_categories"), name: v.optional(v.string()), order: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const { id, ...fields } = args;
        await ctx.db.patch(id, fields);
    },
});

export const deleteCategory = mutation({
    args: { id: v.id("ingredient_categories") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

export const deleteIngredient = mutation({
    args: { id: v.id("ingredients") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
        return { success: true };
    },
});

// ORDERS
export const createOrder = mutation({
    args: {
        userId: v.string(),
        items: v.string(),
        totalAmount: v.number(),
        shippingFee: v.number(),
        recipient: v.string(),
        address: v.string(),
        phone: v.string(),
        message: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const id = await ctx.db.insert("orders", {
            ...args,
            status: "ordered",
            createdAt: new Date().toISOString(),
        });
        return id;
    },
});

export const getOrders = query({
    args: { userId: v.optional(v.string()) }, // if null, admin view (all)
    handler: async (ctx, args) => {
        if (args.userId) {
            return await ctx.db
                .query("orders")
                .withIndex("by_user", (q) => q.eq("userId", args.userId!))
                .order("desc") // sort by creation time if index allows, or js sort
                .collect();
        } else {
            // Admin View: All orders
            // Note: simple query for now. pagination recommended for prod.
            const orders = await ctx.db.query("orders").collect();
            return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
    },
});

export const updateOrderStatus = mutation({
    args: {
        id: v.id("orders"),
        status: v.string(),
        trackingNumber: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...fields } = args;
        await ctx.db.patch(id, fields);
        return { success: true };
    },
});
