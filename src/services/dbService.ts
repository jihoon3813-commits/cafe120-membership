import { User } from '../types';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxDui-wFLOwOyE5pf4EfKuROcuMfaM4pLsuKE1iqfIV7jjOzDEusIpRu1-HdYVJYQ-9Yw/exec';

export const dbService = {
    async login(email: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> {
        if (!SCRIPT_URL) {
            // Placeholder for demo
            if (email === 'admin@cafe120.com' && password === 'admin123') {
                return {
                    success: true,
                    user: { email, name: '관리자', role: 'admin', membership: 'plus', status: 'active' }
                };
            }
            return { success: false, message: '서버 연동 전입니다. (임시 admin 계정: admin@cafe120.com / admin123)' };
        }

        try {
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({ action: 'login', email, password })
            });
            return await response.json();
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: '네트워크 오류가 발생했습니다.' };
        }
    },

    async register(data: any): Promise<{ success: boolean; message?: string }> {
        if (!SCRIPT_URL) {
            console.log('Registering user (demo):', data);
            return { success: true, message: '신청이 완료되었습니다. (데모 모드)' };
        }

        try {
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({ action: 'register', ...data })
            });
            return await response.json();
        } catch (error) {
            return { success: false, message: '네트워크 오류가 발생했습니다.' };
        }
    },

    async getUsers(): Promise<User[]> {
        if (!SCRIPT_URL) return [];
        try {
            const response = await fetch(`${SCRIPT_URL}?action=getUsers`);
            return await response.json();
        } catch (error) {
            return [];
        }
    }
};
