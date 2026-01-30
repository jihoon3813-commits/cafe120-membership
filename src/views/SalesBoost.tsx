import React from 'react';

const SalesBoost: React.FC = () => {
    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-2xl font-bold">전략적 매출 부스트 솔루션 업그레이드 📈</h2>
                <p className="text-slate-500">배달 플랫폼 수수료 최적화 및 로컬 마케팅 분석을 통해 매출의 극대화를 도와드립니다.</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold">배달플랫폼 최적화: 6개월 전략 지원</h3>
                        <span className="bg-orange-100 text-orange-600 text-[10px] px-2 py-0.5 rounded-full font-bold">NEW</span>
                    </div>
                    <div className="aspect-video bg-gray-100 rounded-2xl mb-4 relative overflow-hidden">
                        <img src="https://picsum.photos/seed/pie/600/400" alt="New Menu" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-sm font-medium">배달의민족 신규 '가게 배달 서비스 가입 지원'</p>
                    <ul className="mt-3 space-y-2">
                        <li className="text-xs text-slate-500 flex items-center">✅ 광고비 대비 매출 효율 분석: 4,800회 이상</li>
                        <li className="text-xs text-slate-500 flex items-center">✅ 리뷰 관리 가이드 제공: 2030 고객 취향 저격 전략</li>
                    </ul>
                    <button className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold">배달 최적화 상담 신청</button>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold mb-4">비대면 고효율 홍보물 무상 지원</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-2xl">
                            <p className="text-xs font-bold text-slate-400 mb-1">인기 메뉴 홍보 배너 디자인</p>
                            <p className="text-sm font-medium">"맛과 건강을 동시에, 120칼로리의 행복" - 전단지 렌탈 15% 무상 지원</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl">
                            <p className="text-xs font-bold text-slate-400 mb-1">계절성 배너 제작 지원</p>
                            <p className="text-sm font-medium">아이스아메리카노 + 샌드위치 SET (여름 시즌 7,500원)</p>
                        </div>
                        <button className="w-full py-3 bg-orange-500 text-white rounded-xl text-sm font-bold">6개월 무상 홍보물 지원 신청</button>
                    </div>
                </div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100">
                <h3 className="text-lg font-bold mb-6">SNS 마케팅 대행 서비스 포트폴리오</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative group">
                            <img src={`https://picsum.photos/seed/${i + 10}/300/300`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                <span className="text-white text-xs font-bold">자세히 보기</span>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="mt-4 text-xs text-slate-400 text-center">매달 전문 SNS 마케터가 4회 이상의 고퀄리티 마케팅 게시글을 지원합니다.</p>
            </div>
        </div>
    );
};

export default SalesBoost;
