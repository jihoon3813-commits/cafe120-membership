import React from 'react';

const Equipment: React.FC = () => {
    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-2xl font-bold">장비 & 시설 토탈 관리 서비스 🛠️</h2>
                <p className="text-slate-500">최상의 기구 컨디션 유지를 위한 전문 기술자의 점검과 소모품 교체를 패키지로 지원합니다.</p>
            </header>
            <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 flex items-center justify-between">
                <div>
                    <p className="text-orange-700 font-bold">포함된 무상 정기 점검 패키지</p>
                    <p className="text-orange-600 text-sm mt-1">120칼로리 멤버십 회원 전용: 2024.07.12 예정일</p>
                </div>
                <button className="bg-white text-orange-600 px-4 py-2 rounded-full text-xs font-black shadow-sm hover:bg-orange-50 transition-colors">정기 점검 신청</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-4">냉난방기 공조 시스템 지원</h3>
                    <p className="text-sm text-slate-500 mb-6">"쾌적한 매장 환경 관리를 위한 정기 필터 세척 서비스"</p>
                    <div className="space-y-3">
                        {[
                            "에어컨 작동 효율 확인 및 냉매 체크",
                            "설정 온도와 실제 온도 5도 이상 차이 시 대응",
                            "먼지 자동 집진 시 이상의 소음 발생 시",
                            "필터의 유해균 발생 시 항균 탈취 서비스"
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl text-sm text-slate-700">
                                <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px] font-bold shadow-sm">{idx + 1}</span>
                                {item}
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-3 border border-slate-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">점검 일정 확인</button>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-4">설비 가동 효율</h3>
                    <div className="flex flex-col items-center justify-center py-6">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="364" strokeDashoffset="54" className="text-orange-500" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-black">85%</span>
                                <span className="text-[10px] text-slate-400">전체 장비 상태</span>
                            </div>
                        </div>
                        <p className="mt-6 text-sm text-slate-500 text-center leading-relaxed">
                            매장의 주요 장비들이 원활하게 가동 중입니다. <br /> 다만 에어컨의 냉매 상태가 저하되어 있으니 점검 신청을 권장합니다.
                        </p>
                        <button className="mt-6 w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">장비 AS 가동 지원 신청</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Equipment;
