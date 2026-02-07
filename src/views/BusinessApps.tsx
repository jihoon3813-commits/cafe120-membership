import React, { useState, useEffect } from 'react';
import { generateSnsContent, getTaxConsult, getLaborConsult, getLegalConsult, generateImage as generateGeminiImage } from '../services/gemini';
import { dbService } from '../services/dbService';

const BusinessApps: React.FC = () => {
    const [activeApp, setActiveApp] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string>('');

    // SNS App State
    const [snsInput, setSnsInput] = useState({ menu: '', theme: '활기찬' });
    const [snsOutput, setSnsOutput] = useState('');

    // Design/Image App State
    const [imageInput, setImageInput] = useState({ prompt: '', style: '자연스러운' });
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    // Tax App State
    const [taxInput, setTaxInput] = useState('');
    const [taxOutput, setTaxOutput] = useState('');

    // Labor App State
    const [laborInput, setLaborInput] = useState('');
    const [laborOutput, setLaborOutput] = useState('');

    // Risk App State
    const [riskInput, setRiskInput] = useState('');
    const [riskOutput, setRiskOutput] = useState('');

    useEffect(() => {
        // Load User ID
        try {
            const userStr = localStorage.getItem('currentUser');
            if (userStr) {
                const user = JSON.parse(userStr);
                setUserId(user.email || 'unknown_user');
            } else {
                setUserId('guest');
            }
        } catch (e) {
            setUserId('guest');
        }
    }, []);

    useEffect(() => {
        if (activeApp && activeTab === 'history') {
            loadHistory();
        }
    }, [activeApp, activeTab]);

    // Reset states when leaving an app
    useEffect(() => {
        if (!activeApp) {
            setSnsInput({ menu: '', theme: '활기찬' });
            setSnsOutput('');
            setImageInput({ prompt: '', style: '자연스러운' });
            setImageUrl(null);
            setTaxInput('');
            setTaxOutput('');
            setLaborInput('');
            setLaborOutput('');
            setRiskInput('');
            setRiskOutput('');
            setActiveTab('create');
        }
    }, [activeApp]);

    const loadHistory = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const logs = await dbService.getHistory(userId, activeApp || undefined);
            setHistory(logs || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const apps = [
        { id: 'sns', name: 'AI 스마트 SNS 홍보', desc: '메뉴명만 입력하면 전문 카피라이터처럼 문구 작성', icon: '📝', status: 'RUNNING' },
        { id: 'image', name: 'SNS 이미지 제작', desc: '텍스트만 입력하면 고퀄리티 SNS 홍보 이미지 자동 생성', icon: '🖼️', status: 'RUNNING' },
        { id: 'tax', name: 'AI 세무 컨설턴트', desc: '세금 절약 팁과 신고 가이드를 AI 비서가 지원', icon: '💰', status: 'RUNNING' },
        { id: 'labor', name: 'AI 노무 비서', desc: '근로계약서 검토 및 노무 상담 연계', icon: '📋', status: 'RUNNING' },
        { id: 'risk', name: '리스크 관리 솔루션', desc: '법률/세무/노무 종합 리스크 관리 및 상담', icon: '⚖️', status: 'RUNNING' },
    ];

    const taxPresets = [
        "개인사업자 부가가치세 신고 기간은 언제인가요?",
        "간이과세자와 일반과세자의 차이점은 무엇인가요?",
        "음식점 창업 시 챙겨야 할 세무 일정 알려줘",
        "종합소득세 절세하는 꿀팁 있나요?",
        "직원 식대도 비용 처리가 가능한가요?",
        "사업용 신용카드 등록은 어떻게 하나요?",
        "현금영수증 의무발행 업종인가요?",
        "권리금도 세금 계산서를 발행해야 하나요?",
        "폐업 시 세무 처리는 어떻게 해야 하나요?",
        "배달 앱 매출 누락 시 가산세가 있나요?",
        "인건비 신고를 안 하면 어떻게 되나요?",
        "노란이우산공제 혜택이 무엇인가요?",
        "가족을 직원으로 채용해도 비용 처리 되나요?",
        "임대료 세금계산서는 꼭 받아야 하나요?",
        "의제매입세액공제가 무엇인가요?",
        "접대비 한도는 얼마나 되나요?",
        "부가세 조기환급은 언제 가능한가요?",
        "기장 대리는 매출 얼마부터 하는게 좋나요?",
        "세금 체납 시 불이익은 무엇인가요?",
        "창업 중소기업 세액 감면 혜택 알려줘"
    ];

    const laborPresets = [
        "2026년 최저시급은 얼마인가요?",
        "주휴수당 지급 조건이 어떻게 되나요?",
        "아르바이트생 수습기간 적용 가능한가요?",
        "근로계약서 미작성 시 벌금은 얼마인가요?",
        "하루 4시간 근무자도 퇴직금을 받을 수 있나요?",
        "야간수당은 몇 시부터 적용되나요?",
        "휴게시간은 어떻게 부여해야 하나요?",
        "해고예고수당은 언제 지급해야 하나요?",
        "4대보험 취득신고는 언제까지 해야 하나요?",
        "일일 근로자도 고용보험 가입해야 하나요?",
        "무단 결근 시 급여 차감 가능한가요?",
        "연장근로수당 계산법 알려줘",
        "연차휴가는 아르바이트생에게도 적용되나요?",
        "직원이 퇴사 통보 없이 안 나오면 어떻게 하죠?",
        "CCTV로 직원 감시하면 불법인가요?",
        "급여명세서 교부 의무화가 무엇인가요?",
        "청소년 아르바이트 채용 시 필요한 서류는?",
        "수습기간 중 해고는 자유로운가요?",
        "식대를 급여에 포함해도 되나요?",
        "퇴직금은 분할 지급이 가능한가요?"
    ];

    const riskPresets = [
        "아르바이트생 근로계약서 미작성 시 처벌은?",
        "손님이 식중독 걸렸다고 보상을 요구합니다.",
        "배달 리뷰에 악성 허위 사실이 올라왔어요.",
        "상가 임대차 계약 갱신 거절 사유가 궁금해요.",
        "권리금 회수 기회는 언제까지 보호되나요?",
        "미성년자 주류 판매 시 영업정지 구제 방법",
        "CCTV 영상 열람 요구, 들어줘야 하나요?",
        "화재 보험 필수 특약 추천해주세요.",
        "매장 내 고객 미끄러짐 사고 책임 범위는?",
        "배달 매출 누락 시 부가가치세 수정 신고 방법"
    ];

    const getProvider = async () => {
        return await dbService.getConfig('ai_provider') || 'google';
    };

    const handleSnsGenerate = async () => {
        if (!snsInput.menu) return;
        setLoading(true);
        let result = '';
        try {
            const provider = await getProvider();
            if (provider === 'openai') {
                const prompt = `cafe120 가맹점주를 위한 SNS 마케팅 문구를 작성해줘. 메뉴명: ${snsInput.menu}, 테마: ${snsInput.theme}. 인스타그램 게시물 형식으로 해시태그 포함해서 3가지 버전으로 제안해줘. 이모지도 적절히 사용해.`;
                result = await dbService.generateText(prompt) || '';
            } else {
                result = await generateSnsContent(snsInput.menu, snsInput.theme);
            }
            setSnsOutput(result);
            await dbService.saveHistory(userId, 'sns', `메뉴: ${snsInput.menu}, 테마: ${snsInput.theme}`, result);
        } catch (e) {
            setSnsOutput('오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleImageGenerate = async () => {
        if (!imageInput.prompt) return;
        setLoading(true);
        let result = '';
        try {
            const provider = await getProvider();
            const fullPrompt = `Cafe/Food photography, high quality, ${imageInput.style} style. ${imageInput.prompt}`;

            if (provider === 'google') {
                result = await generateGeminiImage(fullPrompt);
            } else {
                result = await dbService.generateImage(fullPrompt);
            }
            setImageUrl(result);
            await dbService.saveHistory(userId, 'image', `프롬프트: ${imageInput.prompt}, 스타일: ${imageInput.style}`, result);
        } catch (e: any) {
            console.error(e);
            alert('이미지 생성 실패: ' + (e.message || '알 수 없는 오류'));
        } finally {
            setLoading(false);
        }
    };

    const handleTaxConsult = async (query?: string) => {
        const input = query || taxInput;
        if (!input) return;

        // If clicking preset, update input field visually too
        if (query) setTaxInput(query);

        setLoading(true);
        let result = '';
        try {
            const provider = await getProvider();
            if (provider === 'openai') {
                const prompt = `
                    너는 cafe120 가맹점주를 돕는 친절하고 전문적인 AI 세무 컨설턴트야. 
                    질문: ${input}
                    
                    답변 시 주의사항:
                    1. 어려운 세무 용어는 쉽게 풀어서 설명해줘.
                    2. 음식점업/카페 창업자에게 특화된 조언을 해줘.
                    3. 법적 책임이 없음을 마지막에 명시해줘 (참고용으로만 활용).
                    4. 마크다운 형식으로 가독성 있게 작성해줘.
                `;
                result = await dbService.generateText(prompt) || '';
            } else {
                result = await getTaxConsult(input);
            }
            setTaxOutput(result);
            await dbService.saveHistory(userId, 'tax', input, result);
        } catch (e) {
            setTaxOutput('오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleLaborConsult = async (query?: string) => {
        const input = query || laborInput;
        if (!input) return;

        if (query) setLaborInput(query);

        setLoading(true);
        let result = '';
        try {
            const provider = await getProvider();
            if (provider === 'openai') {
                const prompt = `
                    너는 cafe120 가맹점주를 돕는 AI 노무 비서야.
                    질문: ${input}
                    // Same prompt logic as before...
                    // Shortened for brevity in this replace call, but logic implies full prompt
                    답변 시 주의사항:
                    1. 근로기준법에 의거하여 정확하게 답변해줘.
                    2. 아르바이트 채용이 많은 카페 특성을 고려해줘.
                    3. 법적 효력이 없는 참고용 조언임을 명시해줘.
                    4. 마크다운 형식으로 작성해줘.
                `;
                result = await dbService.generateText(prompt) || '';
            } else {
                result = await getLaborConsult(input);
            }
            setLaborOutput(result);
            await dbService.saveHistory(userId, 'labor', input, result);
        } catch (e) {
            setLaborOutput('오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleRiskConsult = async (query?: string) => {
        const input = query || riskInput;
        if (!input) return;
        if (query) setRiskInput(query);
        setLoading(true);
        let result = '';
        try {
            const provider = await getProvider();
            if (provider === 'openai') {
                const prompt = `
                    너는 cafe120 가맹점주를 위한 AI 리스크 관리 법률 컨설턴트야.
                    질문: ${input}
                    
                    답변 시 주의사항:
                    1. 대한민국 법률에 근거하여 전문적으로 답변해줘.
                    2. 세무, 노무, 상가임대차 등 자영업자 관련 리스크를 집중적으로 다뤄줘.
                    3. 법적 효력이 없는 참고용 조언임을 명시해줘.
                    4. 마크다운 형식으로 작성해줘.
                `;
                result = await dbService.generateText(prompt) || '';
            } else {
                result = await getLegalConsult(input);
            }
            setRiskOutput(result);
            await dbService.saveHistory(userId, 'risk', input, result);
        } catch (e) {
            setRiskOutput('오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header>
                <h2 className="text-3xl font-black text-slate-900">비즈니스+ APPs 🚀</h2>
                <p className="text-slate-500 mt-2">가맹점 운영에 즉시 투입 가능한 전문 비즈니스 도구들을 만나보세요.</p>
            </header>

            {!activeApp ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {apps.map((app) => (
                        <div
                            key={app.id}
                            onClick={() => { setActiveApp(app.id); setActiveTab('create'); }}
                            className="p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-lg hover:border-orange-500 hover:-translate-y-1 transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">{app.icon}</div>
                                <span className="bg-orange-500 text-white text-[10px] px-3 py-1 rounded-full font-black animate-pulse">RUNNING</span>
                            </div>
                            <h3 className="text-xl font-black text-slate-800 mb-2">{app.name}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">{app.desc}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-8 rounded-[2.5rem] border-2 border-orange-500/10 shadow-2xl animate-in zoom-in duration-300">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setActiveApp(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors font-bold text-slate-500">← 뒤로</button>
                            <h3 className="text-2xl font-black text-slate-900">
                                {apps.find(a => a.id === activeApp)?.name}
                            </h3>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab('create')}
                                className={`px-4 py-2 rounded-xl font-bold transition-all ${activeTab === 'create' ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-100 text-slate-500 hover:bg-gray-200'}`}
                            >
                                새로 만들기
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`px-4 py-2 rounded-xl font-bold transition-all ${activeTab === 'history' ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-100 text-slate-500 hover:bg-gray-200'}`}
                            >
                                지난 기록
                            </button>
                        </div>
                    </div>

                    {activeTab === 'history' ? (
                        <div className="space-y-4">
                            {loading && <p className="text-center py-10 text-slate-500">불러오는 중...</p>}
                            {!loading && history.length === 0 && (
                                <div className="text-center py-20 text-slate-400">
                                    <span className="text-4xl block mb-2">📭</span>
                                    <p>아직 생성된 기록이 없습니다.</p>
                                </div>
                            )}
                            <div className="grid gap-4">
                                {history.map((log: any, idx) => (
                                    <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-gray-100 hover:border-orange-200 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold text-slate-400">{new Date(log.createdAt).toLocaleString()}</span>
                                            <span className="text-xs bg-white border border-gray-200 px-2 py-1 rounded-md">{log.type}</span>
                                        </div>
                                        <div className="mb-4">
                                            <p className="text-sm font-bold text-slate-500 mb-1">Q. 입력 내용</p>
                                            <p className="text-slate-800 font-medium bg-white p-3 rounded-xl border border-gray-100">{log.input}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-500 mb-1">A. 생성 결과</p>
                                            {log.type === 'image' ? (
                                                <img src={log.output} alt="Generated" className="w-32 h-32 object-cover rounded-xl border" />
                                            ) : (
                                                <div className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto custom-scrollbar bg-white p-3 rounded-xl border border-gray-100">
                                                    {log.output}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* CREATE TAB CONTENT */
                        <>
                            {/* SNS APP UI */}
                            {activeApp === 'sns' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-black text-slate-400 mb-2 uppercase">메뉴명 입력</label>
                                            <input
                                                type="text"
                                                value={snsInput.menu}
                                                onChange={(e) => setSnsInput({ ...snsInput, menu: e.target.value })}
                                                placeholder="예: 120칼로리 저당 단백질 스무디"
                                                className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-slate-400 mb-2 uppercase">홍보 컨셉</label>
                                            <select
                                                value={snsInput.theme}
                                                onChange={(e) => setSnsInput({ ...snsInput, theme: e.target.value })}
                                                className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-medium appearance-none"
                                            >
                                                <option>활기찬</option>
                                                <option>감성적인</option>
                                                <option>전문적인</option>
                                                <option>친근한</option>
                                                <option>유머러스한</option>
                                            </select>
                                        </div>
                                        <button
                                            onClick={handleSnsGenerate}
                                            disabled={loading}
                                            className="w-full py-5 bg-orange-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-500/30 hover:bg-orange-600 transition-all transform active:scale-[0.98] disabled:opacity-50"
                                        >
                                            {loading ? 'AI가 생각하는 중...' : 'SNS 홍보 문구 생성 ✨'}
                                        </button>
                                    </div>
                                    <div className="bg-slate-50 p-8 rounded-3xl border border-gray-100 min-h-[400px] flex flex-col">
                                        <p className="text-xs font-black text-slate-400 mb-6 uppercase tracking-wider">Generated Result</p>
                                        {snsOutput ? (
                                            <div className="text-slate-700 whitespace-pre-wrap leading-relaxed animate-in fade-in duration-500 font-medium">{snsOutput}</div>
                                        ) : (
                                            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
                                                <span className="text-5xl mb-4">✍️</span>
                                                <p className="font-bold">입력하신 정보를 바탕으로 <br />최적의 카피라이팅을 제안합니다.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Image Gen APP UI */}
                            {activeApp === 'image' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-black text-slate-400 mb-2 uppercase">이미지 설명 (프롬프트)</label>
                                            <textarea
                                                value={imageInput.prompt}
                                                onChange={(e) => setImageInput({ ...imageInput, prompt: e.target.value })}
                                                placeholder="예: 창가 테이블에 놓인 시원한 아이스 아메리카노와 디저트, 자연광, 감성적인 분위기"
                                                className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-medium h-32 resize-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-slate-400 mb-2 uppercase">스타일</label>
                                            <select
                                                value={imageInput.style}
                                                onChange={(e) => setImageInput({ ...imageInput, style: e.target.value })}
                                                className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-medium appearance-none"
                                            >
                                                <option>자연스러운 (Natural)</option>
                                                <option>스튜디오 조명 (Studio)</option>
                                                <option>미니멀 (Minimal)</option>
                                                <option>비비드/팝 (Vivid)</option>
                                            </select>
                                        </div>
                                        <button
                                            onClick={handleImageGenerate}
                                            disabled={loading}
                                            className="w-full py-5 bg-orange-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-500/30 hover:bg-orange-600 transition-all transform active:scale-[0.98] disabled:opacity-50"
                                        >
                                            {loading ? '이미지 생성 중(약 10초)...' : '이미지 생성하기 🎨'}
                                        </button>
                                        <p className="text-xs text-slate-400 text-center">* DALL-E 3 / Imagen 4 모델을 사용하여 생성됩니다.</p>
                                    </div>
                                    <div className="bg-slate-50 p-8 rounded-3xl border border-gray-100 min-h-[400px] flex flex-col justify-center items-center">
                                        {imageUrl ? (
                                            <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-500 group">
                                                <img src={imageUrl} alt="Generated" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <a href={imageUrl} target="_blank" rel="noreferrer" className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold hover:bg-orange-500 hover:text-white transition">
                                                        원본 다운로드
                                                    </a>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center opacity-30">
                                                <span className="text-5xl mb-4 block">🖼️</span>
                                                <p className="font-bold">원하는 이미지를 텍스트로 묘사하면 <br />AI가 그려드립니다.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Tax & Labor & Risk (Chat Style) */}
                            {['tax', 'labor', 'risk'].includes(activeApp) && (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
                                    {/* Preset Sidebar */}
                                    <div className="lg:col-span-1 bg-slate-50 rounded-3xl p-6 overflow-y-auto custom-scrollbar border border-gray-100">
                                        <p className="text-xs font-black text-slate-400 mb-4 uppercase tracking-wider">자주 묻는 질문 (추천)</p>
                                        <div className="space-y-2">
                                            {(activeApp === 'tax' ? taxPresets : activeApp === 'labor' ? laborPresets : riskPresets).map((question, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => {
                                                        if (activeApp === 'tax') handleTaxConsult(question);
                                                        else if (activeApp === 'labor') handleLaborConsult(question);
                                                        else handleRiskConsult(question);
                                                    }}
                                                    className="w-full text-left p-3 text-sm font-medium text-slate-600 bg-white rounded-xl border border-gray-100 hover:border-orange-300 hover:text-orange-600 hover:shadow-sm transition-all truncate"
                                                >
                                                    {question}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Chat Area */}
                                    <div className="lg:col-span-2 flex flex-col h-full">
                                        <div className="flex-1 bg-slate-50 rounded-3xl p-8 mb-4 overflow-y-auto border border-gray-100 custom-scrollbar">
                                            {(activeApp === 'tax' ? taxOutput : activeApp === 'labor' ? laborOutput : riskOutput) ? (
                                                <div className="space-y-6">
                                                    <div className="flex justify-end">
                                                        <div className="bg-orange-100 text-orange-900 p-4 rounded-2xl rounded-tr-sm max-w-[80%]">
                                                            <p className="font-bold text-sm mb-1 text-orange-400 uppercase">Q. 질문</p>
                                                            {activeApp === 'tax' ? taxInput : activeApp === 'labor' ? laborInput : riskInput}
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-start">
                                                        <div className="bg-white border border-gray-100 p-6 rounded-2xl rounded-tl-sm max-w-[90%] shadow-sm">
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <span className="text-2xl">
                                                                    {activeApp === 'tax' ? '💰' : activeApp === 'labor' ? '📋' : '⚖️'}
                                                                </span>
                                                                <span className="font-black text-slate-900">
                                                                    {activeApp === 'tax' ? 'AI 세무 컨설턴트' : activeApp === 'labor' ? 'AI 노무 비서' : '리스크 관리 솔루션'}
                                                                </span>
                                                            </div>
                                                            <div className="text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                                                                {activeApp === 'tax' ? taxOutput : activeApp === 'labor' ? laborOutput : riskOutput}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                                    <span className="text-6xl mb-6 grayscale">
                                                        {activeApp === 'tax' ? '👩‍💼' : activeApp === 'labor' ? '👨‍⚖️' : '⚖️'}
                                                    </span>
                                                    <h4 className="text-2xl font-black text-slate-900 mb-2">무엇이든 물어보세요</h4>
                                                    <p className="font-bold text-slate-500 whitespace-pre-line">
                                                        {activeApp === 'tax'
                                                            ? '부가가치세, 종합소득세, 절세 팁 등 \n궁금한 세무 관련 질문을 입력해주세요.'
                                                            : activeApp === 'labor'
                                                                ? '근로계약서, 주휴수당, 퇴직금 등 \n어려운 노무 관련 고민을 해결해드립니다.'
                                                                : '매장 운영 중 발생하는 법적 분쟁, 사기, \n배상 책임 등 리스크 관리를 도와드립니다.'}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <textarea
                                                value={activeApp === 'tax' ? taxInput : activeApp === 'labor' ? laborInput : riskInput}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (activeApp === 'tax') setTaxInput(val);
                                                    else if (activeApp === 'labor') setLaborInput(val);
                                                    else setRiskInput(val);
                                                }}
                                                placeholder="질문을 입력하거나 왼쪽 예시를 클릭하세요"
                                                className="w-full p-6 pr-32 bg-white border-2 border-slate-100 rounded-3xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-lg h-24 resize-none shadow-sm"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        if (activeApp === 'tax') handleTaxConsult();
                                                        else if (activeApp === 'labor') handleLaborConsult();
                                                        else handleRiskConsult();
                                                    }
                                                }}
                                            />
                                            <button
                                                onClick={() => {
                                                    if (activeApp === 'tax') handleTaxConsult();
                                                    else if (activeApp === 'labor') handleLaborConsult();
                                                    else handleRiskConsult();
                                                }}
                                                disabled={loading || !(activeApp === 'tax' ? taxInput : activeApp === 'labor' ? laborInput : riskInput)}
                                                className="absolute right-3 bottom-3 top-3 px-6 bg-slate-900 text-white rounded-2xl font-black hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {loading ? '...' : '전송'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default BusinessApps;
