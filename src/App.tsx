import React, { useState } from 'react';
import { MenuCategory, User } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import SalesBoost from './views/SalesBoost';
import Equipment from './views/Equipment';
import RiskCare from './views/RiskCare';
import BusinessApps from './views/BusinessApps';

import Pricing from './views/Pricing';
import Login from './views/Login';
import Register from './views/Register';
import Admin from './views/Admin';
import ProductManagement from './views/ProductManagement';
import LandingPage from './views/LandingPage';
import OrderManagement from './views/OrderManagement';
import IngredientOrder from './views/IngredientOrder';
import Resources from './views/Resources';
import StoreManagement from './views/StoreManagement';

const App: React.FC = () => {
    const [activeMenu, setActiveMenu] = useState(MenuCategory.HOME);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [preSelectedMembership, setPreSelectedMembership] = useState<string | undefined>(undefined);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const p = params.get('p');
        if (p) {
            setSelectedProductId(p);
            setActiveMenu(MenuCategory.LANDING);
        }
    }, []);

    const handleLogin = (u: User) => {
        setUser(u);
        setActiveMenu(MenuCategory.HOME);
    };

    const handleLogout = () => {
        setUser(null);
        setActiveMenu(MenuCategory.HOME);
    };

    const renderContent = () => {
        // 비회원일 경우 접근 가능 메뉴
        const publicMenus = [MenuCategory.HOME, MenuCategory.PRICING, MenuCategory.REGISTER, MenuCategory.LOGIN, MenuCategory.LANDING];

        if (!user && !publicMenus.includes(activeMenu)) {
            return <Login onLoginSuccess={handleLogin} onNavigateToRegister={() => setActiveMenu(MenuCategory.REGISTER)} />;
        }

        switch (activeMenu) {
            case MenuCategory.HOME:
                return <Dashboard onNavigate={setActiveMenu} />;
            case MenuCategory.SALES:
                return <SalesBoost user={user} />;
            case MenuCategory.EQUIPMENT:
                return <Equipment />;
            case MenuCategory.RISK:
                return <RiskCare />;
            case MenuCategory.APPS:
                return <BusinessApps />;

            case MenuCategory.PRICING:
                return <Pricing onSelectMembership={(type) => {
                    setPreSelectedMembership(type);
                    setActiveMenu(MenuCategory.REGISTER);
                }} />;
            case MenuCategory.LOGIN:
                return <Login onLoginSuccess={handleLogin} onNavigateToRegister={() => {
                    setPreSelectedMembership(undefined);
                    setActiveMenu(MenuCategory.REGISTER);
                }} />;
            case MenuCategory.REGISTER:
                return <Register
                    onSuccess={() => setActiveMenu(MenuCategory.LOGIN)}
                    initialMembershipType={preSelectedMembership}
                />;
            case MenuCategory.ADMIN:
                return <Admin />;
            case MenuCategory.PRODUCT_MGMT:
                return <ProductManagement />;
            case MenuCategory.LANDING:
                return <LandingPage productId={selectedProductId || ''} />;
            case MenuCategory.ORDER_MANAGE:
                return <OrderManagement />;
            case MenuCategory.INGREDIENT_ORDER:
                return <IngredientOrder />;
            case MenuCategory.RESOURCES:
                return <Resources user={user} />;
            case MenuCategory.STORE_MGMT:
                return <StoreManagement />;
            default:
                return <Dashboard onNavigate={setActiveMenu} />;
        }
    };

    const handleSelectMenu = (menu: MenuCategory) => {
        setActiveMenu(menu);
        setIsSidebarOpen(false);
    };

    return (
        <div className="flex min-h-screen bg-gray-50 overflow-hidden relative">
            {activeMenu !== MenuCategory.LANDING && (
                <Sidebar
                    activeMenu={activeMenu}
                    onSelectMenu={handleSelectMenu}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    user={user}
                    onLogout={handleLogout}
                />
            )}

            {/* Mobile Header */}
            {activeMenu !== MenuCategory.LANDING && (
                <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 z-40 shadow-sm">
                    <h1 className="text-xl font-black text-orange-600 tracking-tight">cafe120</h1>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -mr-2 text-slate-600"
                        aria-label="Menu"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>
            )}

            <main className={`flex-1 overflow-y-auto ${activeMenu === MenuCategory.LANDING ? 'p-0 ml-0 pt-0' : 'p-4 md:p-8 ml-0 md:ml-64 pt-20 md:pt-8'} transition-all`}>
                <div className={`${activeMenu === MenuCategory.LANDING ? 'max-w-none pb-0' : 'max-w-6xl mx-auto pb-20'}`}>
                    {renderContent()}
                </div>
            </main>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default App;
