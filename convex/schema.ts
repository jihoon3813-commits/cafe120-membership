import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        email: v.string(),
        password: v.string(), // In production, use hashed passwords or Convex Auth
        name: v.string(),
        role: v.string(), // 'user' | 'admin'
        membership: v.string(), // 'none' | 'basic' | 'plus' | 'egg120' | 'pie120' | 'cafe120'
        status: v.string(), // 'pending' | 'active'
        businessName: v.optional(v.string()),
        businessNo: v.optional(v.string()),
        phone: v.optional(v.string()),
        address: v.optional(v.string()),
        detailAddress: v.optional(v.string()),
        createdAt: v.string(),
    }).index("by_email", ["email"]),
    products: defineTable({
        id: v.string(),
        name: v.string(),
        description: v.string(),
        features: v.array(v.string()),
        commitment: v.optional(v.string()), // 2년 약정
        price: v.string(),
        installments: v.string(),
        initial: v.string(),
        image: v.string(),
        color: v.string(),
        isPremium: v.boolean(),
        active: v.boolean(),
    }).index("by_product_id", ["id"]),
    leads: defineTable({
        productId: v.string(), // product id
        productName: v.string(),
        name: v.string(), // customer name
        phone: v.string(),
        email: v.optional(v.string()), // customer email
        businessName: v.optional(v.string()),
        message: v.optional(v.string()),
        status: v.string(), // 'pending' | 'contacted' | 'resolved'
        createdAt: v.string(),
    })
        .index("by_created_at", ["createdAt"]),
    configs: defineTable({
        key: v.string(),
        value: v.string(),
    }).index("by_key", ["key"]),
    benefits: defineTable({
        id: v.string(),
        productId: v.string(),
        content: v.string(),
        createdAt: v.optional(v.string()),
    }).index("by_product_id", ["productId"]),
    ai_history: defineTable({
        userId: v.string(), // email or user id
        type: v.string(), // sns, image, tax, labor, legal
        input: v.string(),
        output: v.string(),
        createdAt: v.string(),
    }).index("by_user", ["userId"]),
    ingredients: defineTable({
        category: v.string(),
        name: v.string(),
        price: v.number(),
        thumbnail: v.string(),
        detailImage: v.optional(v.string()),
        unit: v.string(), // kg, Box, ea
        minQuantity: v.number(),
        shippingFee: v.number(), // 0, 3000, 5000, ...
        active: v.boolean(),
        order: v.optional(v.number()),
        storageId: v.optional(v.string()),
    }).index("by_category", ["category"]),
    orders: defineTable({
        userId: v.string(),
        items: v.string(), // JSON string of cart items
        totalAmount: v.number(),
        shippingFee: v.number(),
        status: v.string(), // ordered, shipping, completed, cancelled
        trackingNumber: v.optional(v.string()),
        recipient: v.string(),
        address: v.string(),
        phone: v.string(),
        message: v.optional(v.string()),
        createdAt: v.string(),
    }).index("by_user", ["userId"]),
    ingredient_categories: defineTable({
        name: v.string(),
        order: v.number(),
    }).index("by_order", ["order"]),
    resources: defineTable({
        title: v.string(),
        description: v.optional(v.string()),
        type: v.union(v.literal("image"), v.literal("video"), v.literal("file")),
        fileUrl: v.string(),
        fileStorageId: v.optional(v.string()),
        thumbnailUrl: v.optional(v.string()),
        thumbnailStorageId: v.optional(v.string()),
        createdAt: v.number(),
    }).index("by_type", ["type"]),
    stores: defineTable({
        registrationDate: v.string(), // YYYY-MM-DD
        storeName: v.string(),
        ownerName: v.string(),
        mobilePhone: v.string(),
        storePhone: v.string(),
        email: v.string(),
        status: v.union(v.literal("영업중"), v.literal("폐업"), v.literal("계약종료")),
        address: v.string(),
        detailAddress: v.string(),
        remarks: v.optional(v.string()),
        createdAt: v.number(),
    }).index("by_registrationDate", ["registrationDate"]),
});
