import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getStores = query({
    handler: async (ctx) => {
        const stores = await ctx.db.query("stores").collect();
        // Sort by registrationDate descending, then by createdAt descending
        return stores.sort((a, b) => {
            if (b.registrationDate !== a.registrationDate) {
                return b.registrationDate.localeCompare(a.registrationDate);
            }
            return b.createdAt - a.createdAt;
        });
    },
});

export const addStore = mutation({
    args: {
        registrationDate: v.string(),
        storeName: v.string(),
        ownerName: v.string(),
        mobilePhone: v.string(),
        storePhone: v.string(),
        email: v.string(),
        status: v.union(v.literal("영업중"), v.literal("폐업"), v.literal("계약종료")),
        address: v.string(),
        detailAddress: v.string(),
        remarks: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("stores", {
            ...args,
            createdAt: Date.now(),
        });
    },
});

export const bulkAddStores = mutation({
    args: {
        stores: v.array(v.object({
            registrationDate: v.string(),
            storeName: v.string(),
            ownerName: v.string(),
            mobilePhone: v.string(),
            storePhone: v.string(),
            email: v.string(),
            status: v.union(v.literal("영업중"), v.literal("폐업"), v.literal("계약종료")),
            address: v.string(),
            detailAddress: v.string(),
            remarks: v.optional(v.string()),
        })),
    },
    handler: async (ctx, args) => {
        for (const store of args.stores) {
            await ctx.db.insert("stores", {
                ...store,
                createdAt: Date.now(),
            });
        }
    },
});

export const updateStore = mutation({
    args: {
        id: v.id("stores"),
        registrationDate: v.optional(v.string()),
        storeName: v.optional(v.string()),
        ownerName: v.optional(v.string()),
        mobilePhone: v.optional(v.string()),
        storePhone: v.optional(v.string()),
        email: v.optional(v.string()),
        status: v.optional(v.union(v.literal("영업중"), v.literal("폐업"), v.literal("계약종료"))),
        address: v.optional(v.string()),
        detailAddress: v.optional(v.string()),
        remarks: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...fields } = args;
        await ctx.db.patch(id, fields);
    },
});

export const deleteStores = mutation({
    args: { ids: v.array(v.id("stores")) },
    handler: async (ctx, args) => {
        for (const id of args.ids) {
            await ctx.db.delete(id);
        }
    },
});
