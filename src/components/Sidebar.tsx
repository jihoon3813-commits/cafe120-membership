import React from 'react';
import { MenuCategory, User } from '../types';

interface SidebarProps {
    activeMenu: MenuCategory;
    onSelectMenu: (menu: MenuCategory) => void;
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeMenu, onSelectMenu, isOpen, onClose, user, onLogout }) => {
    const menuItems = [
        { cat: MenuCategory.HOME, icon: '🏠', show: true },
        { cat: MenuCategory.SALES, icon: '📈', show: !!user },
        { cat: MenuCategory.EQUIPMENT, icon: '🛠️', show: !!user },
        { cat: MenuCategory.RISK, icon: '⚖️', show: !!user },
        { cat: MenuCategory.APPS, icon: '🚀', special: true, show: !!user },
        { cat: MenuCategory.MYPAGE, icon: '👤', show: !!user },
        { cat: MenuCategory.PRICING, icon: '🎫', show: true },
        { cat: MenuCategory.ADMIN, icon: '⚙️', show: user?.role === 'admin' },
        { cat: MenuCategory.REGISTER, icon: '📝', show: !user },
        { cat: MenuCategory.LOGIN, icon: '🔑', show: !user },
    ];

    return (
        <aside className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-50 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
            <div className="p-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-orange-600 tracking-tight">cafe120</h1>
                    <p className="text-xs text-slate-400 font-bold uppercase mt-1">Membership Plus</p>
                </div>
                <button onClick={onClose} className="md:hidden p-2 text-slate-400 hover:text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
                {menuItems.filter(item => item.show).map((item) => (
                    <button
                        key={item.cat}
                        onClick={() => onSelectMenu(item.cat)}
                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${activeMenu === item.cat
                            ? 'bg-orange-50 text-orange-700'
                            : 'text-slate-600 hover:bg-gray-100'} ${item.special ? 'mt-6 border border-orange-100 shadow-sm' : ''}`}
                    >
                        <span className="mr-3 text-lg">{item.icon}</span>
                        {item.cat}
                        {item.special && (
                            <span className="ml-auto bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full animate-pulse">PRO</span>
                        )}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100">
                {user ? (
                    <div className="space-y-3">
                        <div className="bg-slate-900 rounded-2xl p-4 text-white">
                            <p className="text-xs opacity-70 mb-1">{user.name} 회원님</p>
                            <p className="font-bold flex items-center">
                                {user.membership === 'plus' ? 'Membership Plus' : user.membership === 'basic' ? 'Basic Membership' : '비회원'}
                                {user.membership !== 'none' && <span className="ml-2 text-xs bg-orange-500 px-1.5 rounded text-white">ON</span>}
                            </p>
                        </div>
                        <button
                            onClick={onLogout}
                            className="w-full py-3 text-xs font-bold text-slate-400 hover:text-red-500 transition border border-gray-100 rounded-xl"
                        >
                            로그아웃
                        </button>
                    </div>
                ) : (
                    <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                        <p className="text-xs text-orange-700 font-bold mb-2">더 많은 혜택을 원하시나요?</p>
                        <button
                            onClick={() => onSelectMenu(MenuCategory.REGISTER)}
                            className="w-full py-2 bg-orange-500 text-white text-xs font-black rounded-lg shadow-sm"
                        >
                            지금 바로 시작하기
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
