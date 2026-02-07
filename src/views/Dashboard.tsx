import React from 'react';
import { MenuCategory } from '../types';

interface DashboardProps {
    onNavigate: (menu: MenuCategory) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    const pillars = [
        { title: '매출 부스트 솔루션', desc: '전문적인 매출 향상을 도와주는 전략 패키지', icon: '📈', cat: MenuCategory.SALES },
        { title: '비즈니스+ APPs', desc: 'AI 자동 홍보물 생성 및 비즈니스 도구', icon: '🚀', cat: MenuCategory.APPS },
        { title: '재료 주문', desc: '매장에 필요한 식자재 간편 주문', icon: '🛒', cat: MenuCategory.INGREDIENT_ORDER },
        { title: '자료실', desc: '이미지, 영상 등 매장 지원 자료실', icon: '📂', cat: MenuCategory.RESOURCES },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Hero Section */}
            <div className="relative h-[400px] w-full rounded-[3rem] overflow-hidden shadow-2xl mb-12 group">
                <img
                    src="https://github.com/jihoon3813-commits/img_120/blob/main/%5B%ED%81%AC%EA%B8%B0%EB%B3%80%ED%99%98%5D%EC%A0%9C%ED%92%88_120%EA%B2%B9_2.JPG?raw=true"
                    alt="cafe120 Hero"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10 md:p-16">
                    <span className="inline-block px-4 py-1 bg-orange-500 text-white text-xs font-black rounded-full mb-4 w-fit animate-bounce">NEW PREMIUM</span>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                        세상에 없던 <br />
                        <span className="text-orange-500">120겹의 감동</span>을 만나보세요.
                    </h1>
                    <p className="text-white/70 text-lg max-w-lg mb-8">
                        cafe120 멤버십 회원님만을 위한 <br />
                        최상의 퀄리티와 차별화된 비즈니스가 기다립니다.
                    </p>
                </div>
            </div>

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">
                        안녕하세요, <span className="text-orange-600">cafe120 멤버십 회원님</span> 파이팅!
                    </h2>
                    <p className="text-slate-500 mt-2">
                        "회원님은 매장 운영에만 집중하세요. 나머지는 저희가 책임지고 도와드리겠습니다"
                    </p>
                </div>
                {/* <button
                    onClick={() => onNavigate(MenuCategory.PRICING)}
                    className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-bold hover:bg-orange-200 transition"
                >
                    멤버십 혜택 전체보기 →
                </button> */}
            </header>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {pillars.map((p) => (
                    <div
                        key={p.title}
                        onClick={() => onNavigate(p.cat)}
                        className="group p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all cursor-pointer flex flex-col items-center text-center"
                    >
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-4xl group-hover:bg-orange-50 group-hover:scale-110 transition-all duration-300 mb-6">
                            {p.icon}
                        </div>
                        <h3 className="text-xl font-black text-slate-800 mb-2">{p.title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed word-keep-all">{p.desc}</p>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default Dashboard;
