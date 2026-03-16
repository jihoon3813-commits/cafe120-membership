import { query } from "./_generated/server";

export const listStorage = query({
    handler: async (ctx) => {
        // Unfortunately, Convex doesn't have a direct "list storage" API in the storage object.
        // We usually track storageIds in a table.
        // Let's check the 'resources' table and 'ingredients' table.
        const resources = await ctx.db.query("resources").collect();
        const ingredients = await ctx.db.query("ingredients").collect();
        return { resources, ingredients };
    },
});
