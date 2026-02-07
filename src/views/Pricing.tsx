import React from 'react';

interface PricingProps {
    onSelectMembership: (type: string) => void;
}

const Pricing: React.FC<PricingProps> = ({ onSelectMembership }) => {
    const memberships = [
        {
            id: 'egg120',
            name: 'egg120 Membership',
            desc: '요즘 핫한 에그120을 부담없이 도입할 수 있는 멤버십 상품입니다.',
            commitment: '2년 약정',
            price: '99,000',
            installments: 'X 23회(2~24회)',
            initial: '최초 1회는 입회비 포함 100만원 결제',
            image: 'https://github.com/jihoon3813-commits/img_120/blob/main/%5B%ED%81%AC%EA%B8%B0%EB%B3%80%ED%99%98%5D%5B%ED%81%AC%EA%B8%B0%EB%B3%80%ED%99%98%5D240503_120%EA%B2%B9%ED%8C%8C%EC%9D%B40929%20(1).jpg?raw=true',
            features: [
                '샵인샵 풀패키지 제공',
                '머신 코팅 서비스 연 1회(총 2회)',
                '비즈니스+ APPs 제공',
                '리스크 케어 AI 서비스 제공'
            ],
            color: 'orange',
            isPremium: false
        },
        {
            id: 'pie120',
            name: 'pie120 Membership',
            desc: 'cafe120의 대표 브랜드인 120겹파이로 꾸준한 매출 상승 효과를 누려 보세요.',
            commitment: '2년 약정',
            price: '129,000',
            installments: 'X 23회(2~24회)',
            initial: '최초 1회는 입회비 포함 150만원 결제',
            image: 'https://github.com/jihoon3813-commits/img_120/blob/main/%EC%97%B0%EC%B6%9C_120%EA%B2%B9_2.jpg?raw=true',
            features: [
                '샵인샵 풀패키지 제공',
                '머신 코팅 서비스 연 1회(총 2회)',
                '비즈니스+ APPs 제공',
                '리스크 케어 AI 서비스 제공'
            ],
            color: 'orange',
            isPremium: true
        },
        {
            id: 'cafe120',
            name: 'cafe120 Membership',
            desc: 'pie&egg120 두톱 브랜드로 우리동네 인기 카페로 우뚝 설 수 있어요.',
            commitment: '2년 약정',
            price: '199,000',
            installments: 'X 23회(2~24회)',
            initial: '최초 1회는 입회비 포함 250만원 결제',
            image: 'https://github.com/jihoon3813-commits/img_120/blob/main/%EC%A0%9C%ED%92%88_%ED%8C%A8%ED%82%A4%EC%A7%80_1.jpg?raw=true',
            features: [
                '샵인샵 풀패키지 제공(egg+pie)',
                '머신 코팅 서비스 각각 연 1회(총 4회)',
                '비즈니스+ APPs 제공',
                '리스크 케어 AI 서비스 제공'
            ],
            color: 'slate',
            isPremium: false
        }
    ];

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
                        key={idx}
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
                                <p className={`text-sm mt-3 leading-relaxed ${item.color === 'slate' ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</p>
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
                                {item.features.map((feature, fIdx) => (
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
