import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { Product } from '../types';

interface PricingProps {
    onSelectMembership: (type: string) => void;
}

const Pricing: React.FC<PricingProps> = ({ onSelectMembership }) => {
    const [memberships, setMemberships] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMemberships = async () => {
            const products = await dbService.getProducts();
            setMemberships(products.filter(p => p.active));
            setLoading(false);
        };
        fetchMemberships();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 font-bold">멤버십 플랜 로딩 중...</p>
            </div>
        );
    }

    if (memberships.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-slate-400 font-bold text-xl italic">현재 신청 가능한 멤버십 플랜이 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="space-y-16 pb-20">
            <header className="text-center space-y-4 max-w-3xl mx-auto px-4">
                <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-xs font-black rounded-full uppercase tracking-wider">Membership Plans</span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">비즈니스+ 멤버십 <br /><span className="text-orange-600">성장 가이드</span> 제안 드립니다.</h2>
                <p className="text-slate-500 text-lg">
                    운영 비용 절감 효과뿐만 아니라 마케팅 도구와 전문가 컨설팅까지 한 번에 누릴 수 있는 유일한 멤버십 솔루션입니다.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-7xl mx-auto px-4">
                {memberships.map((item, idx) => (
                    <div
                        key={item.id}
                        className={`relative rounded-[3.5rem] border transition-all duration-500 hover:scale-[1.03] flex flex-col overflow-hidden ${item.isPremium
                            ? 'bg-white border-orange-500 shadow-2xl ring-4 ring-orange-500/10 z-10'
                            : item.color === 'slate'
                                ? 'bg-slate-900 border-slate-800 shadow-xl'
                                : 'bg-white border-gray-100 shadow-lg'
                            }`}
                    >
                        {/* Image Section */}
                        <div className="relative h-64 overflow-hidden">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>

                        {item.isPremium && (
                            <div className="absolute top-4 right-8 bg-orange-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap z-20">
                                가장 인기있는 멤버십
                            </div>
                        )}

                        <div className="p-10 flex-1 flex flex-col">
                            <div className="mb-8">
                                <h3 className={`text-2xl font-black ${item.color === 'slate' ? 'text-white' : 'text-slate-900'}`}>{item.name}</h3>
                                <p className={`text-sm mt-3 leading-relaxed ${item.color === 'slate' ? 'text-slate-400' : 'text-slate-500'}`}>{item.description}</p>
                            </div>

                            <div className={`py-6 border-y ${item.color === 'slate' ? 'border-white/10' : 'border-gray-100'}`}>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${item.color === 'slate' ? 'bg-slate-800 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>{item.commitment}</span>
                                <div className="mt-4 flex items-baseline gap-1">
                                    <span className={`text-4xl font-black ${item.color === 'slate' ? 'text-white' : 'text-slate-900'}`}>{item.price}</span>
                                    <span className={`font-bold ${item.color === 'slate' ? 'text-slate-500' : 'text-slate-400'}`}>원 / 월</span>
                                </div>
                                <p className={`text-xs mt-1 font-bold ${item.color === 'slate' ? 'text-orange-400' : 'text-orange-500'}`}>{item.installments}</p>
                                <p className={`text-[11px] mt-4 p-3 rounded-xl ${item.color === 'slate' ? 'bg-slate-800/50 text-slate-400' : 'bg-orange-50 text-orange-600 font-medium'}`}>
                                    💡 {item.initial}
                                </p>
                            </div>

                            <ul className="space-y-4 my-8 flex-1">
                                {item.features?.map((feature, fIdx) => (
                                    <li key={fIdx} className="flex items-start gap-3">
                                        <span className={`mt-1 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${item.color === 'slate' ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-600'}`}>
                                            ✓
                                        </span>
                                        <span className={`text-sm font-medium ${item.color === 'slate' ? 'text-slate-300' : 'text-slate-600'}`}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => onSelectMembership(item.id)}
                                className={`w-full py-5 rounded-2xl font-black transition-all transform active:scale-[0.98] ${item.isPremium
                                    ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20 hover:bg-orange-600'
                                    : item.color === 'slate'
                                        ? 'bg-white text-slate-900 hover:bg-orange-50'
                                        : 'bg-slate-900 text-white hover:bg-slate-800'
                                    }`}>
                                멤버십 신청하기
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="max-w-3xl mx-auto text-center py-12 border-t border-gray-100">
                <p className="text-slate-400 text-sm italic">"본 서비스는 가맹점의 브랜드 파워 향상을 위해 준비되었습니다. 적극적인 참여와 활용 바랍니다."</p>
            </div>
        </div>
    );
};

export default Pricing;
