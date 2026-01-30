import React, { useState } from 'react';
import { dbService } from '../services/dbService';
import { User, MenuCategory } from '../types';

interface LoginProps {
    onLoginSuccess: (user: User) => void;
    onNavigateToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onNavigateToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await dbService.login(email, password);
        setLoading(false);

        if (result.success && result.user) {
            onLoginSuccess(result.user);
        } else {
            setError(result.message || '이메일 또는 비밀번호가 올바르지 않습니다.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-[2.5rem] shadow-xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-slate-900 mb-2">반갑습니다!</h2>
                <p className="text-slate-500">cafe120 멤버십 로그인</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">이메일 주소</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                        placeholder="example@cafe120.com"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                        placeholder="••••••••"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-all transform active:scale-[0.98] disabled:opacity-50"
                >
                    {loading ? '로그인 중...' : '로그인'}
                </button>
            </form>

            <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                <p className="text-slate-500 text-sm mb-4">아직 멤버십 회원이 아니신가요?</p>
                <button
                    onClick={onNavigateToRegister}
                    className="text-orange-600 font-bold hover:underline"
                >
                    멤버십 신청하기 (회원가입)
                </button>
            </div>
        </div>
    );
};

export default Login;
