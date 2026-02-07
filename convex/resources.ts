import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getResources = query({
    handler: async (ctx) => {
        const resources = await ctx.db.query("resources").order("desc").collect();
        return Promise.all(resources.map(async (res) => ({
            ...res,
            fileUrl: res.fileStorageId ? (await ctx.storage.getUrl(res.fileStorageId)) || res.fileUrl : res.fileUrl,
            thumbnailUrl: res.thumbnailStorageId ? (await ctx.storage.getUrl(res.thumbnailStorageId)) || res.thumbnailUrl : res.thumbnailUrl,
        })));
    },
});

export const addResource = mutation({
    args: {
        title: v.string(),
        description: v.optional(v.string()),
        type: v.union(v.literal("image"), v.literal("video"), v.literal("file")),
        fileUrl: v.string(),
        fileStorageId: v.optional(v.string()),
        thumbnailUrl: v.optional(v.string()),
        thumbnailStorageId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("resources", {
            ...args,
            createdAt: Date.now(),
        });
    },
});

export const updateResource = mutation({
    args: {
        id: v.id("resources"),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        type: v.optional(v.union(v.literal("image"), v.literal("video"), v.literal("literal"))),
        fileUrl: v.optional(v.string()),
        fileStorageId: v.optional(v.string()),
        thumbnailUrl: v.optional(v.string()),
        thumbnailStorageId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...fields } = args;
        // @ts-ignore
        await ctx.db.patch(id, fields);
    },
});

export const deleteResource = mutation({
    args: { id: v.id("resources") },
    handler: async (ctx, args) => {
        const resource = await ctx.db.get(args.id);
        if (resource?.fileStorageId) {
            await ctx.storage.delete(resource.fileStorageId);
        }
        if (resource?.thumbnailStorageId) {
            await ctx.storage.delete(resource.thumbnailStorageId);
        }
        await ctx.db.delete(args.id);
    },
});
