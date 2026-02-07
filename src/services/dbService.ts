import { User, Product, Lead } from '../types';
import { ConvexClient } from 'convex/browser';
import { api } from '../../convex/_generated/api';

let convexClient: ConvexClient | null = null;
const getConvex = () => {
    if (!convexClient) {
        // @ts-ignore
        const url = import.meta.env?.VITE_CONVEX_URL;
        const convexUrl = url || "https://placeholder-url.convex.cloud";
        convexClient = new ConvexClient(convexUrl);
    }
    return convexClient;
};

export const dbService = {
    // Configs
    async saveConfig(key: string, value: string) {
        // @ts-ignore
        return await getConvex().mutation(api.configs.saveConfig, { key, value });
    },
    async getConfig(key: string) {
        // @ts-ignore
        return await getConvex().query(api.configs.getConfig, { key });
    },
    async generateText(prompt: string) {
        // @ts-ignore
        return await getConvex().action(api.openai.generateText, { prompt });
    },
    // OpenAI Image Gen
    async generateImage(prompt: string) {
        // @ts-ignore
        return await getConvex().action(api.openai.generateImage, { prompt });
    },

    async login(email: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> {
        try {
            // @ts-ignore
            const result = await getConvex().query(api.users.login, { email, password });
            return result as any;
        } catch (error) {
            console.error('Login error:', error);
            // Fallback for demo/dev if convex is not running or other error
            if (email === 'admin@cafe120.com' && password === 'admin123') {
                return {
                    success: true,
                    user: {
                        email: 'admin@cafe120.com',
                        name: '총괄관리자',
                        role: 'admin' as const,
                        membership: 'plus' as const,
                        status: 'active' as const
                    }
                };
            }
            return { success: false, message: '서버 연결 오류가 발생했습니다.' };
        }
    },

    async register(data: any): Promise<{ success: boolean; message?: string }> {
        try {
            // @ts-ignore
            const result = await getConvex().mutation(api.users.register, data);
            return result;
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, message: '가입 중 오류가 발생했습니다.' };
        }
    },

    async getUsers(): Promise<User[]> {
        try {
            // @ts-ignore
            return await getConvex().query(api.users.getUsers);
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    async updateUser(id: string, updates: any): Promise<void> {
        try {
            // @ts-ignore
            await getConvex().mutation(api.users.updateUser, { id, ...updates });
        } catch (error) {
            console.error(error);
        }
    },

    async deleteUser(id: string): Promise<void> {
        try {
            // @ts-ignore
            await getConvex().mutation(api.users.deleteUser, { id });
        } catch (error) {
            console.error(error);
        }
    },

    // 상품 관리
    async getProducts(): Promise<Product[]> {
        try {
            // @ts-ignore
            const products = await getConvex().query(api.products.list);

            // Fallback to localStorage logic if Convex is empty (optional for migration)
            // But prompt said "move data to convex", so we should rely on convex.
            // If empty, return empty array.
            return products;
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    async saveProduct(product: any): Promise<void> {
        try {
            // Check if product exists
            // @ts-ignore
            const products = await getConvex().query(api.products.list);
            const exists = products.some((p: any) => p.id === product.id);

            if (exists) {
                // @ts-ignore
                await getConvex().mutation(api.products.update, {
                    id: product.id,
                    fieldsToUpdate: {
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        active: product.active,
                        image: product.image,
                        features: product.features
                    }
                });
            } else {
                // @ts-ignore
                await getConvex().mutation(api.products.create, product);
            }
        } catch (e) {
            console.error(e);
        }
    },

    // 상담 신청 (Leads)
    async submitLead(lead: any): Promise<void> {
        try {
            // @ts-ignore
            await getConvex().mutation(api.leads.submit, lead);
        } catch (e) {
            console.error(e);
        }
    },

    async getLeads(): Promise<Lead[]> {
        try {
            // @ts-ignore
            return await getConvex().query(api.leads.list);
        } catch (e) {
            console.error(e);
            return [];
        }
    },

    // AI History
    async saveHistory(userId: string, type: string, input: string, output: string) {
        // @ts-ignore
        return await getConvex().mutation(api.ai.saveHistory, { userId, type, input, output });
    },

    async getHistory(userId: string, type?: string) {
        // @ts-ignore
        return await getConvex().query(api.ai.getMyHistory, { userId, type });
    },

    // SHOP (Ingredients & Orders)
    async getIngredients(category?: string) {
        try {
            // @ts-ignore
            return await getConvex().query(api.shop.getIngredients, { category });
        } catch (e) {
            console.error(e);
            return [];
        }
    },
    async getAllIngredients() { // For Admin
        try {
            // @ts-ignore
            return await getConvex().query(api.shop.getAllIngredients);
        } catch (e) {
            return [];
        }
    },
    async addIngredient(data: any) {
        // @ts-ignore
        return await getConvex().mutation(api.shop.addIngredient, data);
    },
    async updateIngredient(id: string, data: any) {
        // @ts-ignore
        return await getConvex().mutation(api.shop.updateIngredient, { id, ...data });
    },
    async deleteIngredient(id: string) {
        // @ts-ignore
        return await getConvex().mutation(api.shop.deleteIngredient, { id });
    },
    async createOrder(orderData: any) {
        // @ts-ignore
        return await getConvex().mutation(api.shop.createOrder, orderData);
    },
    async getOrders(userId?: string) {
        try {
            // @ts-ignore
            return await getConvex().query(api.shop.getOrders, { userId });
        } catch (e) {
            console.error(e);
            return [];
        }
    },
    async updateOrderStatus(id: string, status: string, trackingNumber?: string) {
        // @ts-ignore
        return await getConvex().mutation(api.shop.updateOrderStatus, { id, status, trackingNumber });
    },
    async generateUploadUrl() {
        // @ts-ignore
        return await getConvex().mutation(api.shop.generateUploadUrl);
    },
    async reorderIngredients(updates: { id: string, order: number }[]) {
        // @ts-ignore
        return await getConvex().mutation(api.shop.reorderIngredients, { updates });
    },

    // SHOP CATEGORIES
    async getCategories() {
        try {
            // @ts-ignore
            return await getConvex().query(api.shop.getCategories);
        } catch (e) {
            console.error(e);
            return [];
        }
    },
    async addCategory(data: any) {
        // @ts-ignore
        return await getConvex().mutation(api.shop.addCategory, data);
    },
    async updateCategory(id: string, data: any) {
        // @ts-ignore
        return await getConvex().mutation(api.shop.updateCategory, { id, ...data });
    },
    async deleteCategory(id: string) {
        // @ts-ignore
        return await getConvex().mutation(api.shop.deleteCategory, { id });
    },

    // RESOURCES
    async getResources() {
        // @ts-ignore
        return await getConvex().query(api.resources.getResources);
    },
    async addResource(data: any) {
        // @ts-ignore
        return await getConvex().mutation(api.resources.addResource, data);
    },
    async updateResource(id: string, data: any) {
        // @ts-ignore
        return await getConvex().mutation(api.resources.updateResource, { id, ...data });
    },
    async deleteResource(id: any) {
        // @ts-ignore
        return await getConvex().mutation(api.resources.deleteResource, { id });
    },

    // STORES
    async getStores() {
        // @ts-ignore
        return await getConvex().query(api.stores.getStores);
    },
    async addStore(data: any) {
        // @ts-ignore
        return await getConvex().mutation(api.stores.addStore, data);
    },
    async bulkAddStores(stores: any[]) {
        // @ts-ignore
        return await getConvex().mutation(api.stores.bulkAddStores, { stores });
    },
    async updateStore(id: string, data: any) {
        // @ts-ignore
        return await getConvex().mutation(api.stores.updateStore, { id, ...data });
    },
    async deleteStores(ids: string[]) {
        // @ts-ignore
        return await getConvex().mutation(api.stores.deleteStores, { ids });
    }
};
