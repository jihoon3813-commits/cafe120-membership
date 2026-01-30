import React from 'react';
import { MenuCategory } from '../types';

interface DashboardProps {
    onNavigate: (menu: MenuCategory) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    const pillars = [
        { title: '매출 부스트 솔루션', desc: '전문적인 매출 향상을 도와주는 전략 패키지', icon: '📈', cat: MenuCategory.SALES },
        { title: '설비 케어', desc: '고성능 기구 관리 및 소모품 교체', icon: '🛠️', cat: MenuCategory.EQUIPMENT },
        { title: '리스크 케어', desc: '세무/노무/법무 전문가 지원', icon: '⚖️', cat: MenuCategory.RISK },
        { title: '재충전 지원', desc: '매 월 최대 5만원 재충전 혜택', icon: '🎁', cat: MenuCategory.MYPAGE },
        { title: '마케팅 대행', desc: '체험단 제작부터 검색광고까지', icon: '📦', cat: MenuCategory.SALES },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">
                        안녕하세요, <span className="text-orange-600">cafe120 멤버십 회원님</span> 파이팅!
                    </h2>
                    <p className="text-slate-500 mt-2">
                        "회원님은 매장 운영에만 집중하세요. 나머지는 저희가 책임지고 도와드리겠습니다"
                    </p>
                </div>
                <button
                    onClick={() => onNavigate(MenuCategory.PRICING)}
                    className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-bold hover:bg-orange-200 transition"
                >
                    멤버십 혜택 전체보기 →
                </button>
            </header>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pillars.map((p) => (
                    <div
                        key={p.title}
                        onClick={() => onNavigate(p.cat)}
                        className="group p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all cursor-pointer"
                    >
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-orange-50 transition-colors">
                            {p.icon}
                        </div>
                        <h3 className="mt-4 text-lg font-bold text-slate-800">{p.title}</h3>
                        <p className="mt-1 text-sm text-slate-500 leading-relaxed">{p.desc}</p>
                    </div>
                ))}
            </section>
            <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden">
                <div className="relative z-10 max-w-xl">
                    <h3 className="text-2xl font-bold mb-4">비즈니스+ APPs 출시 안내</h3>
                    <p className="opacity-70 mb-8 leading-relaxed">
                        AI가 생성하는 SNS 홍보글, 홍보물 디자인 자동 생성, 세무/노무 컨설턴트 등 회원님의 성공을 위해 준비한 프리미엄 비즈니스 도구들을 만나보세요.
                    </p>
                    <button
                        onClick={() => onNavigate(MenuCategory.APPS)}
                        className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold hover:bg-orange-50 transition"
                    >
                        비즈니스 도구 체험하기
                    </button>
                </div>
                <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-orange-500/20 to-transparent pointer-events-none" />
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-orange-500 rounded-full blur-3xl opacity-20" />
            </div>
        </div>
    );
};

export default Dashboard;
