import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

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

        // Trigger Discord notification as a background action
        await ctx.scheduler.runAfter(0, api.leads.notifyDiscord, {
            productId: args.productId,
            productName: args.productName,
            name: args.name,
            phone: args.phone,
            businessName: args.businessName,
            message: args.message,
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

export const updateStatus = mutation({
    args: {
        id: v.id("leads"),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { status: args.status });
    },
});

export const remove = mutation({
    args: {
        ids: v.array(v.id("leads")),
    },
    handler: async (ctx, args) => {
        for (const id of args.ids) {
            await ctx.db.delete(id);
        }
    },
});

export const notifyDiscord = action({
    args: {
        productId: v.string(),
        productName: v.string(),
        name: v.string(),
        phone: v.string(),
        businessName: v.optional(v.string()),
        message: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const DISCORD_WEBHOOK_URL = "https://discordapp.com/api/webhooks/1483267630671335455/s05kBo-y7qktOdrnUvXqKc3uV5iPq_Y66KVtq_y2y_OBKXkxdseMh-JUTQL2aOFlYL_g";

        const embed = {
            title: "🔔 새로운 상담 신청이 접수되었습니다!",
            color: 0xFFA500, // Orange
            fields: [
                { name: "관심 상품", value: args.productName || args.productId, inline: true },
                { name: "신청자명", value: args.name, inline: true },
                { name: "연락처", value: args.phone, inline: true },
                { name: "업체명", value: args.businessName || "없음", inline: true },
                { name: "상담 내용", value: args.message || "내용 없음" },
            ],
            footer: {
                text: "cafe120 Membership Plus",
            },
            timestamp: new Date().toISOString(),
        };

        try {
            await fetch(DISCORD_WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    embeds: [embed],
                }),
            });
        } catch (error) {
            console.error("Discord Notification Error:", error);
        }
    },
});
