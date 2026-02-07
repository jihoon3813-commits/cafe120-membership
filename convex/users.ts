import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Login: check if user exists and password matches
export const login = query({
    args: { email: v.string(), password: v.string() },
    handler: async (ctx, args) => {
        // Master Admin Override (replicating logic from dbService.ts)
        if (args.email === 'admin@cafe120.com' && args.password === 'admin123') {
            return {
                success: true,
                user: {
                    email: args.email,
                    name: '총괄관리자',
                    role: 'admin',
                    membership: 'plus',
                    status: 'active'
                }
            };
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();

        if (!user) {
            return { success: false, message: "이메일 또는 비밀번호가 올바르지 않습니다." };
        }

        if (user.password !== args.password) {
            return { success: false, message: "이메일 또는 비밀번호가 올바르지 않습니다." };
        }

        // Return user object (excluding password)
        const { password, ...safeUser } = user;
        return { success: true, user: safeUser };
    },
});

// Register: create a new user if email doesn't exist
export const register = mutation({
    args: {
        email: v.string(),
        password: v.string(),
        name: v.string(),
        phone: v.optional(v.string()),
        businessName: v.optional(v.string()),
        businessNo: v.optional(v.string()),
        address: v.optional(v.string()),
        detailAddress: v.optional(v.string()),
        membership: v.optional(v.string()), // Optional, default to 'none' if empty
    },
    handler: async (ctx, args) => {
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();

        if (existingUser) {
            return { success: false, message: "이미 가입된 이메일입니다." };
        }

        const newUserId = await ctx.db.insert("users", {
            email: args.email,
            password: args.password,
            name: args.name,
            role: "user",
            membership: args.membership || "none",
            status: "pending", // Require admin approval
            businessName: args.businessName,
            businessNo: args.businessNo,
            phone: args.phone,
            address: args.address,
            detailAddress: args.detailAddress,
            createdAt: new Date().toISOString(),
        });

        return { success: true, message: "가입이 완료되었습니다." };
    },
});

// Get Users: helper for admin or listing
export const getUsers = query({
    args: {},
    handler: async (ctx) => {
        const users = await ctx.db.query("users").collect();
        return users.map(({ password, ...user }) => user);
    },
});

// Update User: admin only
export const updateUser = mutation({
    args: {
        id: v.id("users"),
        name: v.optional(v.string()),
        businessName: v.optional(v.string()),
        businessNo: v.optional(v.string()),
        phone: v.optional(v.string()),
        membership: v.optional(v.string()),
        status: v.optional(v.string()),
        memo: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...fields } = args;
        await ctx.db.patch(id, fields);
        return { success: true };
    },
});

// Delete User: admin only
export const deleteUser = mutation({
    args: { id: v.id("users") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
        return { success: true };
    },
});
