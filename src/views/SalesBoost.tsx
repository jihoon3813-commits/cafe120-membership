import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface Recipe {
    id: string;
    month: string;
    title: string;
    name: string;
    price: string;
    target: string;
    imageUrl: string;
    isNew?: boolean;
}

interface SalesBoostProps {
    user: User | null;
}

const SalesBoost: React.FC<SalesBoostProps> = ({ user }) => {
    // Recipe Management
    const [recipes, setRecipes] = useState<Recipe[]>(() => {
        const saved = localStorage.getItem('recipes');
        return saved ? JSON.parse(saved) : [
            {
                id: 'recipe-1',
                month: '6월',
                title: '신메뉴 레시피: 6월의 파이',
                name: '트로피컬 크림 파이',
                price: '4,800원',
                target: '2030 여성, 간식 구매자',
                imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1200',
                isNew: true
            }
        ];
    });

    const [selectedRecipeId, setSelectedRecipeId] = useState<string>(recipes[0].id);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [newRecipe, setNewRecipe] = useState<Partial<Recipe>>({
        month: '7월',
        title: '신메뉴 레시피: 7월의 파이',
        imageUrl: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&q=80&w=1200'
    });

    const selectedRecipe = recipes.find(r => r.id === selectedRecipeId) || recipes[0];

    useEffect(() => {
        localStorage.setItem('recipes', JSON.stringify(recipes));
    }, [recipes]);

    const handleAddRecipe = (e: React.FormEvent) => {
        e.preventDefault();
        const recipe: Recipe = {
            id: `recipe-${Date.now()}`,
            month: newRecipe.month || '신규',
            title: newRecipe.title || '신규 레시피',
            name: newRecipe.name || '미정',
            price: newRecipe.price || '0원',
            target: newRecipe.target || '모든 고객',
            imageUrl: newRecipe.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1200',
            isNew: true
        };
        setRecipes([recipe, ...recipes]);
        setSelectedRecipeId(recipe.id);
        setShowAdminModal(false);
        setNewRecipe({
            month: '7월',
            title: '신메뉴 레시피: 7월의 파이',
            imageUrl: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&q=80&w=1200'
        });
    };

    // Marketing Copy Logic: Max 10 items, circular overwrite
    const [templates, setTemplates] = useState<string[]>(() => {
        const saved = localStorage.getItem('marketing_templates');
        return saved ? JSON.parse(saved) : [
            '"한 입의 행복, 120겹의 기적" - 클릭률 15% 상승 효과',
            '에그베이컨 파이 + 아메리카노 SET (할인가 7,500원)'
        ];
    });
    const [nextIndex, setNextIndex] = useState(() => {
        const saved = localStorage.getItem('marketing_next_index');
        return saved ? parseInt(saved) : templates.length;
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [lastAddedIndex, setLastAddedIndex] = useState<number | null>(null);

    useEffect(() => {
        localStorage.setItem('marketing_templates', JSON.stringify(templates));
        localStorage.setItem('marketing_next_index', nextIndex.toString());
    }, [templates, nextIndex]);

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            const mockTips = [
                '"갓 구운 120겹 파이, 지금 바로 만나보세요!" - 유입률 20% 상승',
                '"오늘의 단짠 조합: 콘버터 파이 & 아이스 라떼" - 추천 메뉴 효과',
                '"바쁜 아침, 에그120으로 든든하게 시작하세요" - 모닝족 타겟',
                '"겉바속촉의 정석, 에그120 베이컨 파이 포장 시 할인" - 포장 활성화',
                '"아이들 간식 걱정 끝! 영양 가득 에그 파이" - 맘카페 베스트',
                '"120겹의 정성이 담긴 프리미엄 디저트" - 브랜드 이미지 강화',
                '"퇴근길 나를 위한 작은 선물, 에그120" - 1인 가구 타겟',
                '"주말 나들이 필수템, 120겹 파이 세트" - 피크닉 테마',
                '"아침을 깨우는 고소한 향기, 카페120 오픈!" - 인근 직장인 타겟',
                '"달달한 커스터드와 진한 아메리카노의 꿀조합" - 오후 당충전 추천'
            ];
            const newTip = mockTips[Math.floor(Math.random() * mockTips.length)];

            setTemplates(prev => {
                const updated = [...prev];
                const cleanTip = newTip.replace(/^"|"$/g, '');
                const formattedTip = `"${cleanTip}"`;

                if (updated.length < 10) {
                    updated.push(formattedTip);
                    setLastAddedIndex(updated.length - 1);
                } else {
                    const targetIdx = nextIndex % 10;
                    updated[targetIdx] = formattedTip;
                    setLastAddedIndex(targetIdx);
                }
                return updated;
            });
            setNextIndex(prev => (prev + 1));
            setIsGenerating(false);
        }, 800);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('문구가 복사되었습니다.');
    };

    const assets = [
        { name: 'Brand Logo', type: 'PNG (Transparent)', url: 'https://github.com/jihoon3813-commits/img_120/blob/main/egg120_logo_2.png?raw=true' },
        { name: 'Original Menu', type: 'High-Res JPG', url: 'https://cdn.imweb.me/upload/S2025012040623186e3bd4/611372b19d376.png' },
        { name: 'Bacon Menu', type: 'High-Res JPG', url: 'https://cdn.imweb.me/upload/S2025012040623186e3bd4/361fc20931736.png' },
        { name: 'Custard Menu', type: 'High-Res JPG', url: 'https://cdn.imweb.me/upload/S2025012040623186e3bd4/5872657a6276b.png' },
        { name: 'Cone Butter Menu', type: 'High-Res JPG', url: 'https://cdn.imweb.me/upload/S2025012040623186e3bd4/e9d6dd5517d45.png' },
        { name: 'June Promo Poster', type: 'A4 Format', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1200' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-600 rounded-lg text-[10px] font-black tracking-widest uppercase">
                        Monthly Booster
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900">전략적 매출 부스트 솔루션 📈</h2>
                    <p className="text-slate-500 font-bold text-lg">시즌별 최적화된 레시피와 마케팅 가이드를 통해 매출 극대화를 도와드립니다.</p>
                </div>
                {user?.role === 'admin' && (
                    <button
                        onClick={() => setShowAdminModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-orange-600 transition-all shadow-lg shadow-slate-900/10"
                    >
                        <span className="text-lg">＋</span> 신규 레시피 등록
                    </button>
                )}
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recipe Card */}
                <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col group transition-all duration-500 hover:-translate-y-1">
                    <div className="p-8 pb-0 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black text-slate-800">{selectedRecipe.title}</h3>
                            {selectedRecipe.isNew && <span className="px-2 py-0.5 bg-orange-500 text-white text-[9px] font-black rounded uppercase animate-pulse">NEW</span>}
                        </div>

                        {/* Recipe Selector */}
                        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
                            {recipes.map(r => (
                                <button
                                    key={r.id}
                                    onClick={() => setSelectedRecipeId(r.id)}
                                    className={`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all ${selectedRecipeId === r.id
                                        ? 'bg-slate-900 text-white shadow-md'
                                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                        }`}
                                >
                                    {r.month} {r.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 space-y-8 flex-1">
                        <div className="relative aspect-[16/9] rounded-[2rem] overflow-hidden bg-slate-100">
                            <img
                                src={selectedRecipe.imageUrl}
                                alt={selectedRecipe.name}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                            <div className="absolute bottom-6 left-6 text-white">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">{selectedRecipe.month} Special Edition</p>
                                <p className="text-xl font-black">{selectedRecipe.name}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-lg font-black text-slate-800">{selectedRecipe.month} 한정 '{selectedRecipe.name}'</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-green-50 rounded-lg flex items-center justify-center text-green-500 text-[10px]">✓</div>
                                    <p className="text-sm font-bold text-slate-600">권장 소비자가: <span className="text-slate-900">{selectedRecipe.price}</span></p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 text-[10px]">✓</div>
                                    <p className="text-sm font-bold text-slate-600">타겟 고객: <span className="text-slate-900">{selectedRecipe.target}</span></p>
                                </div>
                            </div>
                        </div>

                        <button className="w-full py-4 bg-slate-900 text-white rounded-[1.2rem] font-black text-sm hover:bg-orange-500 transition-all flex items-center justify-center gap-2 group/btn shadow-lg shadow-slate-900/10">
                            레시피 다운로드
                            <svg className="w-4 h-4 transform group-hover/btn:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Marketing Guide Card */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col group transition-all duration-500 hover:-translate-y-1">
                    <h3 className="text-xl font-black text-slate-800 mb-8">배달앱 최적화 가이드</h3>

                    <div className="space-y-6 flex-1 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                        {templates.map((text, idx) => (
                            <div
                                key={idx}
                                onClick={() => copyToClipboard(text)}
                                className={`p-5 rounded-[1.5rem] border transition-all cursor-pointer relative group/item ${lastAddedIndex === idx
                                    ? 'bg-orange-50 border-orange-200 ring-1 ring-orange-100'
                                    : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-orange-200'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-1.5 h-1.5 rounded-full ${lastAddedIndex === idx ? 'bg-orange-600 animate-pulse' : 'bg-slate-300'}`}></span>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            {idx < 2 && idx === templates.indexOf(templates[idx]) ? '기본 가이드' : `AI 분석 문구 ${idx + 1}`}
                                        </p>
                                    </div>
                                    {lastAddedIndex === idx && (
                                        <span className="text-[8px] font-black bg-orange-500 text-white px-1.5 py-0.5 rounded uppercase">NEW</span>
                                    )}
                                </div>
                                <p className="text-sm md:text-base font-black text-slate-800 leading-relaxed pr-8">
                                    {text}
                                </p>
                                <div className="absolute right-4 bottom-4 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                    </svg>
                                </div>
                            </div>
                        ))}

                    </div>

                    <div className="mt-8">
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="w-full py-4 bg-orange-500 text-white rounded-[1.2rem] font-black text-sm hover:bg-slate-900 transition-all flex items-center justify-center gap-2 group/btn shadow-lg shadow-orange-500/10 disabled:opacity-50"
                        >
                            {isGenerating ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white mr-2" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    AI 분석 중...
                                </>
                            ) : (
                                <>
                                    <span className="text-lg">✨</span> AI 마케팅 문구 생성 (최대 10개)
                                    <svg className="w-4 h-4 ml-1 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Image Center Section */}
            <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200/40 border border-slate-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="space-y-1">
                        <h3 className="text-2xl font-black text-slate-900">이미지 센터 (Media Center)</h3>
                        <p className="text-slate-400 font-bold text-sm">홍보에 필요한 고퀄리티 브랜드 자산을 바로 다운로드하세요.</p>
                    </div>
                    <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-orange-500 transition-all">전체 자산 다운로드 (ZIP)</button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                    {assets.map((asset, i) => (
                        <div key={i} className="group cursor-pointer">
                            <div className="aspect-square bg-slate-50 rounded-[2rem] border border-slate-100 overflow-hidden mb-3 relative">
                                <img src={asset.url} alt={asset.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <a href={asset.url} download className="p-3 bg-white text-slate-900 rounded-full shadow-xl hover:scale-110 transition-transform">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                            <div className="px-1">
                                <p className="text-sm font-black text-slate-800 truncate">{asset.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold tracking-wider">{asset.type}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Consultant Section */}
            <div className="bg-slate-900 rounded-[2.5rem] p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-orange-500/20 transition-colors"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black text-white">더 많은 매출 노하우가 필요하신가요?</h3>
                        <p className="text-slate-400 font-medium">1:1 매출 증대를 위한 전문가 컨설팅을 신청해 보세요.</p>
                    </div>
                    <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm hover:bg-orange-500 hover:text-white transition-all whitespace-nowrap">
                        1:1 컨설팅 신청하기
                    </button>
                </div>
            </div>
            {/* Admin Modal */}
            {showAdminModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-2xl font-black text-slate-900">신규 레시피 등록</h3>
                            <button onClick={() => setShowAdminModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleAddRecipe} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">출시 월</label>
                                    <input
                                        type="text"
                                        value={newRecipe.month}
                                        onChange={e => setNewRecipe({ ...newRecipe, month: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all text-sm font-bold"
                                        placeholder="예: 7월"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">권장 소비자 가격</label>
                                    <input
                                        type="text"
                                        value={newRecipe.price}
                                        onChange={e => setNewRecipe({ ...newRecipe, price: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all text-sm font-bold"
                                        placeholder="예: 4,800원"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">레시피 제목</label>
                                <input
                                    type="text"
                                    value={newRecipe.title}
                                    onChange={e => setNewRecipe({ ...newRecipe, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all text-sm font-bold"
                                    placeholder="예: 신메뉴 레시피: 7월의 파이"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">메뉴 이름</label>
                                <input
                                    type="text"
                                    value={newRecipe.name}
                                    onChange={e => setNewRecipe({ ...newRecipe, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all text-sm font-bold"
                                    placeholder="예: 블루베리 요거트 파이"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">타겟 고객</label>
                                <input
                                    type="text"
                                    value={newRecipe.target}
                                    onChange={e => setNewRecipe({ ...newRecipe, target: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all text-sm font-bold"
                                    placeholder="예: 학생, 전 연령대"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">이미지 URL</label>
                                <input
                                    type="url"
                                    value={newRecipe.imageUrl}
                                    onChange={e => setNewRecipe({ ...newRecipe, imageUrl: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all text-sm font-bold"
                                    placeholder="https://..."
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black text-sm hover:bg-slate-900 transition-all shadow-lg shadow-orange-500/10">
                                레시피 등록 완료
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesBoost;
