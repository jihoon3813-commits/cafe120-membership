"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const generateImage = action({
    args: {
        prompt: v.string(),
    },
    handler: async (ctx, args) => {
        // 1. Get API Key from database or environment
        // @ts-ignore
        let apiKey = await ctx.runQuery(api.configs.getConfig, { key: "openai_api_key" });

        if (!apiKey) {
            apiKey = process.env.OPENAI_API_KEY;
        }

        if (!apiKey) {
            throw new Error("OpenAI API Key가 설정되지 않았습니다.\n관리자 페이지(Admin) 하단의 '시스템 API 설정'에서 키를 저장해주세요.");
        }

        // 2. Call OpenAI DALL-E 3
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "dall-e-3",
                prompt: args.prompt,
                n: 1,
                size: "1024x1024",
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.error?.message || response.statusText;
            throw new Error(`OpenAI API Error: ${errorMessage}`);
        }

        const data = await response.json();
        return data.data[0].url;
    },
});

export const generateText = action({
    args: {
        prompt: v.string(),
    },
    handler: async (ctx, args) => {
        // 1. Get API Key
        // @ts-ignore
        let apiKey = await ctx.runQuery(api.configs.getConfig, { key: "openai_api_key" });
        if (!apiKey) apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            throw new Error("OpenAI API Key가 설정되지 않았습니다.");
        }

        // 2. Call OpenAI GPT
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // Cost-effective model
                messages: [{ role: "user", content: args.prompt }],
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    },
});
