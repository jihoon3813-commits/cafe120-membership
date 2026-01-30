import React, { useState } from 'react';
import { generateSnsContent } from '../services/gemini';

const BusinessApps: React.FC = () => {
    const [activeApp, setActiveApp] = useState<string | null>(null);
    const [snsInput, setSnsInput] = useState({ menu: '', theme: '활기찬' });
    const [snsOutput, setSnsOutput] = useState('');
    const [loading, setLoading] = useState(false);

    const apps = [
        { id: 'sns', name: 'AI 스마트 SNS 홍보', desc: '메뉴명만 입력하면 전문 카피라이터처럼 문구 작성', icon: '📝' },
        { id: 'design', name: 'AI 홍보물 디자인', desc: '메뉴판, 포스터 디자인 자동 생성 (Coming Soon)', icon: '🎨', status: 'Coming Soon' },
        { id: 'tax', name: 'AI 세무 컨설턴트', desc: '세금 절약 팁과 신고 가이드를 AI 비서가 지원', icon: '💰', status: 'Coming Soon' },
        { id: 'labor', name: 'AI 노무 비서', desc: '근로계약서 검토 및 노무 상담 연계', icon: '📋', status: 'Coming Soon' },
    ];

    const handleSnsGenerate = async () => {
        if (!snsInput.menu) return;
        setLoading(true);
        try {
            const res = await generateSnsContent(snsInput.menu, snsInput.theme);
            setSnsOutput(res || '');
        } catch (e) {
            setSnsOutput('콘텐츠 생성 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-2xl font-bold">비즈니스+ APPs 🚀</h2>
                <p className="text-slate-500">가맹점 운영에 즉시 투입 가능한 전문 비즈니스 도구들을 만나보세요.</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {apps.map((app) => (
                    <div
                        key={app.id}
                        onClick={() => app.id === 'sns' && setActiveApp('sns')}
                        className={`p-6 bg-white rounded-3xl border border-gray-100 shadow-sm transition-all ${app.status ? 'opacity-60 cursor-not-allowed' : 'hover:border-orange-500 cursor-pointer active:scale-95'}`}
                    >
                        <div className="flex justify-between items-start">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl">{app.icon}</div>
                            {app.status && <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-bold">{app.status}</span>}
                            {!app.status && <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">RUNNING</span>}
                        </div>
                        <h3 className="mt-4 font-bold text-slate-800">{app.name}</h3>
                        <p className="text-sm text-slate-500 mt-1">{app.desc}</p>
                    </div>
                ))}
            </div>
            {activeApp === 'sns' && (
                <div className="mt-12 bg-white p-8 rounded-[2.5rem] border-2 border-orange-500/20 shadow-2xl animate-in zoom-in duration-300">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold">AI 전용 SNS 홍보 문구 생성기</h3>
                        <button onClick={() => setActiveApp(null)} className="text-slate-400 hover:text-slate-600 transition-colors">닫기 ✕</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">메뉴명 입력</label>
                                <input
                                    type="text"
                                    value={snsInput.menu}
                                    onChange={(e) => setSnsInput({ ...snsInput, menu: e.target.value })}
                                    placeholder="예: 120칼로리 저당 단백질 스무디"
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-orange-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">홍보 컨셉</label>
                                <select
                                    value={snsInput.theme}
                                    onChange={(e) => setSnsInput({ ...snsInput, theme: e.target.value })}
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-orange-500 transition-colors"
                                >
                                    <option>활기찬</option>
                                    <option>감성적인</option>
                                    <option>전문적인</option>
                                    <option>친근한</option>
                                </select>
                            </div>
                            <button
                                onClick={handleSnsGenerate}
                                disabled={loading}
                                className="w-full py-4 bg-orange-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition disabled:opacity-50"
                            >
                                {loading ? 'AI 생성 중...' : 'SNS 홍보 문구 생성'}
                            </button>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-3xl border border-gray-100 min-h-[300px] flex flex-col">
                            <p className="text-xs font-bold text-slate-400 mb-4 uppercase">생성된 마케팅 문구 결과</p>
                            {snsOutput ? (
                                <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{snsOutput}</div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
                                    <span className="text-4xl mb-4">✍️</span>
                                    <p className="text-sm">메뉴명과 테마를 입력하고 <br /> 하단의 버튼을 눌러보세요.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BusinessApps;
