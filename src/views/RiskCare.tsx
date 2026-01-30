import React, { useState } from 'react';
import { getLegalConsult } from '../services/gemini';

const RiskCare: React.FC = () => {
    const [query, setQuery] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConsult = async () => {
        if (!query) return;
        setLoading(true);
        try {
            const res = await getLegalConsult(query);
            setAnswer(res || '');
        } catch (e) {
            setAnswer('상담 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-2xl font-bold">리스크 관리 솔루션 패키지 ⚖️</h2>
                <p className="text-slate-500">노무/세무/법무 전문가 법률 상담 서비스를 통해 복잡한 상황 해결을 도와드립니다.</p>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold mb-4">AI 전문가 리스크 컨설턴트</h3>
                        <textarea
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="질문: 아르바이트생 근로계약서 미작성 시 어떤 법적 제재를 받게 되나요? 어떻게 대응해야 할지 알려주세요."
                            className="w-full h-32 p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition"
                        />
                        <button
                            onClick={handleConsult}
                            disabled={loading}
                            className="w-full mt-4 py-3 bg-orange-500 text-white rounded-xl font-bold disabled:opacity-50 hover:bg-orange-600 transition-colors"
                        >
                            {loading ? 'AI 분석 중...' : '전문 답변 받기'}
                        </button>
                        {answer && (
                            <div className="mt-6 p-6 bg-orange-50 rounded-2xl text-sm text-slate-700 whitespace-pre-wrap leading-relaxed border border-orange-100">
                                <span className="font-bold text-orange-600 block mb-2">Consultant Response:</span>
                                {answer}
                            </div>
                        )}
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold mb-6">현장 법률 서식 (Ready-to-Use)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 cursor-pointer transition-colors">
                                <p className="font-bold text-sm">📄 배달 플랫폼 표준 정산 내역서</p>
                                <p className="text-xs text-slate-400 mt-1">세무신고 증빙용 & 정기 정산</p>
                            </div>
                            <div className="p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 cursor-pointer transition-colors">
                                <p className="font-bold text-sm">⚖️ 고용계약/취업규칙/급여명세서</p>
                                <p className="text-xs text-slate-400 mt-1">노무 전문가 감수 법적 효력 모델</p>
                            </div>
                            <div className="p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 cursor-pointer transition-colors">
                                <p className="font-bold text-sm">📓 임대 기간 vs 연장 계약서</p>
                                <p className="text-xs text-slate-400 mt-1">건물주와의 법적 분쟁 방지 필수 파일</p>
                            </div>
                            <div className="p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 cursor-pointer transition-colors">
                                <p className="font-bold text-sm">📸 🤝 개인정보 보호 홍보 활용 동의</p>
                                <p className="text-xs text-slate-400 mt-1">고객의 정보 수집 시 필수 서약서</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-slate-900 p-8 rounded-3xl text-white">
                        <h3 className="text-lg font-bold mb-4">리스크 Q&A 센터</h3>
                        <div className="space-y-4">
                            <div className="pb-4 border-b border-white/10">
                                <p className="text-xs opacity-50 uppercase mb-1">Tax</p>
                                <p className="text-sm font-medium">배달 매출 누락 시 부가가치세 수정 신고 방법</p>
                            </div>
                            <div className="pb-4 border-b border-white/10">
                                <p className="text-xs opacity-50 uppercase mb-1">Labor</p>
                                <p className="text-sm font-medium">근로계약서 필수기재사항 누락 시 벌금 안내</p>
                            </div>
                            <div className="pb-4">
                                <p className="text-xs opacity-50 uppercase mb-1">Legal</p>
                                <p className="text-sm font-medium">상가 임대차 보호법 권리금 회수 기회 보장</p>
                            </div>
                        </div>
                        <button className="w-full mt-6 py-3 bg-white/10 rounded-xl text-xs font-bold hover:bg-white/20 transition-colors">리스크 컨설팅 예약하기</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiskCare;
