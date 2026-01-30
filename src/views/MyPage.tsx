import React from 'react';

const MyPage: React.FC = () => {
    const history = [
        { date: '2024.05.31', title: '재충전 지원 캐시백', value: '+50,000P', status: '지급완료' },
        { date: '2024.05.15', title: '상조 가입 적립', value: '+15,000P', status: '적립완료' },
        { date: '2024.05.01', title: '멤버십 정기 결제', value: '-149,000원', status: '결제완료' },
        { date: '2024.04.30', title: '재충전 지원 캐시백', value: '+50,000P', status: '지급완료' },
    ];

    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">마이페이지 👤</h2>
                    <p className="text-slate-500">회원님의 현재 멤버십 상태와 혜택 이용 현황을 확인해보세요.</p>
                </div>
                <button className="text-slate-400 text-sm font-medium hover:text-slate-900 underline transition-colors">멤버십 해지/변경</button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">총 사용 가능한 비즈니스 포인트</p>
                    <p className="text-3xl font-black text-orange-600">450,000P</p>
                    <button className="mt-4 text-xs font-bold text-slate-600 hover:text-orange-500 transition-colors">포인트 충전 및 사용처 안내 →</button>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">누적 무상 설비 케어 할인액</p>
                    <p className="text-3xl font-black text-slate-900">225,000원</p>
                    <p className="mt-4 text-[10px] text-slate-400">정기 점검 및 소모품 무상 교체 포함 산정 금액</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">장비 시설 가동률</p>
                    <p className="text-3xl font-black text-slate-900">2대 <span className="text-sm font-normal text-slate-400">/ 총 4대</span></p>
                    <div className="mt-4 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className="w-1/2 h-full bg-orange-500" />
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="font-bold">최근 멤버십 가입 증빙 및 활동 내역</h3>
                    <select className="text-xs border-none bg-gray-50 rounded-lg p-1 px-2 outline-none">
                        <option>최근 3개월</option>
                        <option>전체 기간</option>
                    </select>
                </div>
                <div className="divide-y divide-gray-50">
                    {history.map((h, i) => (
                        <div key={i} className="p-4 px-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-400">{h.date}</span>
                                <span className="font-bold text-slate-800">{h.title}</span>
                            </div>
                            <div className="text-right">
                                <span className={`font-black ${h.value.startsWith('+') ? 'text-orange-600' : 'text-slate-900'}`}>{h.value}</span>
                                <span className="block text-[10px] text-slate-400">{h.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-gray-100 p-8 rounded-3xl text-center">
                <h4 className="font-bold text-slate-800">멤버십 전환을 고민 중이신가요?</h4>
                <p className="text-sm text-slate-500 mt-2">1:1 컨설턴트 전용 채널을 통해 회원님에게 가장 적합한 멤버십 최적화를 제안받으실 수 있습니다.</p>
                <div className="mt-6 flex gap-4 justify-center">
                    <button className="px-6 py-2 bg-white border border-gray-200 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors">나의 등급 확인하기</button>
                    <button className="px-6 py-2 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-800 transition-colors">1:1 상담 연결하기</button>
                </div>
            </div>
        </div>
    );
};

export default MyPage;
