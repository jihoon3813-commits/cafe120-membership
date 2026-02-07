import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { dbService } from '../services/dbService';

interface LandingPageProps {
    productId: string;
    onBack?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ productId, onBack }) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        businessName: '',
        message: ''
    });

    useEffect(() => {
        const fetchProduct = async () => {
            const products = await dbService.getProducts();
            const found = products.find(p => p.id === productId);
            setProduct(found || null);
            setLoading(false);
        };
        fetchProduct();
    }, [productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product) return;

        await dbService.submitLead({
            ...formData,
            productId: product.id,
            productName: product.name
        });
        setFormSubmitted(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8 text-center">
                <h2 className="text-4xl font-black text-slate-900 mb-4">상품을 찾을 수 없습니다.</h2>
                <p className="text-slate-500 mb-8">존재하지 않거나 삭제된 랜딩페이지입니다.</p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="px-8 py-4 bg-orange-500 text-white rounded-2xl font-black shadow-lg"
                >
                    메인으로 돌아가기
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header / Navigation */}
            <header className="fixed top-0 left-0 w-full z-[100] bg-white/80 backdrop-blur-xl border-b border-gray-100 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <img
                            src="https://github.com/jihoon3813-commits/img_120/blob/main/egg120_logo_2.png?raw=true"
                            alt="EGG 120"
                            className="h-12 md:h-16 w-auto object-contain transition-transform hover:scale-105"
                        />
                    </div>

                    <nav className="hidden md:flex items-center gap-10">
                        {[
                            { name: '브랜드 스토리', id: 'story' },
                            { name: '메뉴 라인업', id: 'info' },
                            { name: '창업 포인트', id: 'success' },
                            { name: '멤버십 혜택', id: 'pricing' },
                            { name: '가맹문의', id: 'consult' }
                        ].map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                className="text-slate-600 hover:text-orange-500 font-bold text-sm transition-colors tracking-tight"
                            >
                                {item.name}
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        <a
                            href="#consult"
                            className="hidden sm:flex px-6 py-3 bg-slate-900 text-white rounded-full font-black text-xs hover:bg-orange-500 transition-all shadow-xl shadow-slate-900/10"
                        >
                            창업 상담신청
                        </a>
                        <button className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 bg-slate-50 rounded-xl">
                            <span className="w-5 h-0.5 bg-slate-900 rounded-full"></span>
                            <span className="w-5 h-0.5 bg-slate-900 rounded-full"></span>
                            <span className="w-5 h-0.5 bg-slate-900 rounded-full"></span>
                        </button>
                    </div>
                </div>
            </header>
            {/* Floating Contact Bar (Mobile) */}
            <div className="md:hidden fixed bottom-6 right-6 z-50">
                <a href="#consult" className="w-14 h-14 bg-orange-500 text-white rounded-full shadow-2xl flex items-center justify-center animate-bounce">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </a>
            </div>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-gradient-to-br from-[#FFD700] via-[#FFC107] to-[#FFB800]">
                <div className="absolute inset-0 pointer-events-none opacity-30">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.4),transparent)]"></div>
                </div>

                <div className="relative max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8 text-center lg:text-left animate-in fade-in slide-in-from-left duration-1000">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/30 backdrop-blur-md rounded-full border border-white/40">
                            <span className="flex h-2 w-2 rounded-full bg-white animate-ping"></span>
                            <span className="text-slate-900 text-xs font-black uppercase tracking-widest">Premium Shop-in-Shop Brand</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1]">
                            디저트 성공신화 <br />
                            <span className="text-white drop-shadow-sm">{productId === 'egg120' ? 'EGG 120' : product.name}</span> <br />
                            브랜드의 시작
                        </h1>
                        <p className="text-xl text-slate-800 font-bold leading-relaxed max-w-xl">
                            {productId === 'egg120'
                                ? '120겹파이의 노하우가 담긴 세상에 없던 프리미엄 계란빵. 검증된 매출과 간편한 운영으로 성공 창업을 시작하세요.'
                                : product.description}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center lg:justify-start">
                            <a href="#consult" className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-2xl hover:bg-black transition-all transform hover:scale-105 active:scale-95 text-center">
                                가맹 문의 신청하기
                            </a>
                            <a href="#info" className="w-full sm:w-auto px-10 py-5 bg-white/80 backdrop-blur-md text-slate-900 border border-white/50 rounded-2xl font-black text-lg shadow-lg hover:bg-white transition-all text-center">
                                성공 전략 비법
                            </a>
                        </div>
                    </div>

                    <div className="relative animate-in fade-in zoom-in duration-1000 delay-300">
                        <div className="absolute -inset-4 bg-orange-500/10 rounded-[3rem] blur-2xl"></div>
                        <div className="relative rounded-[3rem] overflow-hidden shadow-3xl border-8 border-white">
                            <img src={product.image} alt={product.name} className="w-full h-auto object-cover transform hover:scale-110 transition-transform duration-700" />
                        </div>
                        {/* Summary Badges */}
                        <div className="absolute -top-8 -right-8 bg-white p-6 rounded-3xl shadow-2xl border border-orange-50 animate-bounce delay-700 hidden md:block">
                            <p className="text-[10px] font-black text-orange-500 uppercase tracking-tighter">Market Success</p>
                            <p className="text-2xl font-black text-slate-900">전국 287개점</p>
                        </div>
                        <div className="absolute -bottom-8 -left-8 bg-slate-900 p-6 rounded-3xl shadow-2xl animate-pulse hidden md:block">
                            <p className="text-[10px] font-black text-orange-400 uppercase">Preparation</p>
                            <p className="text-2xl font-black text-white">단 6분 완성!</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEW: Real Egg Highlights Section */}
            <section id="story" className="py-32 bg-[#FFF9E6] relative">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <div className="space-y-4 mb-16 animate-in fade-in slide-in-from-bottom duration-1000">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                            기존의 계란빵은 가라! <br />
                            맛과 영양까지 챙긴 <span className="text-orange-600 italic"><br className="md:hidden" />REAL</span> 계란빵 탄생!
                        </h2>
                        <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-full text-sm font-bold">
                            <span className="text-orange-400">!</span>
                            소화가 편하고 부드럽고 촉촉한<br className="md:hidden" />100% 쌀반죽만 사용했습니다!
                        </div>
                    </div>

                    <div className="relative max-w-4xl mx-auto mb-20">
                        {/* Central Image Container */}
                        <div className="relative z-10 w-64 h-64 md:w-80 md:h-80 mx-auto rounded-full overflow-hidden border-8 border-white shadow-2xl">
                            <img src="https://cdn.imweb.me/upload/S2025012040623186e3bd4/6bc08568cdf40.jpg" alt="Real Egg Bread" className="w-full h-full object-cover" />
                        </div>

                        {/* ZERO Cards - Surrounding the image */}
                        <div className="grid grid-cols-2 gap-4 md:absolute md:inset-0 md:grid-cols-1 pointer-events-none mt-8 md:mt-0 flex items-center justify-center">
                            {/* Left Side Cards */}
                            <div className="md:absolute md:left-[5%] lg:left-[10%] md:top-1/4 md:-translate-y-1/2 bg-white w-full md:w-48 py-8 rounded-[2.5rem] shadow-xl border border-orange-50 pointer-events-auto transform hover:scale-105 transition-transform text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ZERO</p>
                                <p className="text-xl md:text-2xl font-black text-slate-900">항생제</p>
                            </div>
                            <div className="md:absolute md:left-[5%] lg:left-[10%] md:bottom-1/4 md:translate-y-1/2 bg-white w-full md:w-48 py-8 rounded-[2.5rem] shadow-xl border border-orange-50 pointer-events-auto transform hover:scale-105 transition-transform text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ZERO</p>
                                <p className="text-xl md:text-2xl font-black text-slate-900">살충제</p>
                            </div>
                            {/* Right Side Cards */}
                            <div className="md:absolute md:right-[5%] lg:right-[10%] md:top-1/4 md:-translate-y-1/2 bg-white w-full md:w-48 py-8 rounded-[2.5rem] shadow-xl border border-orange-50 pointer-events-auto transform hover:scale-105 transition-transform text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ZERO</p>
                                <p className="text-xl md:text-2xl font-black text-slate-900">합성착색제</p>
                            </div>
                            <div className="md:absolute md:right-[5%] lg:right-[10%] md:bottom-1/4 md:translate-y-1/2 bg-white w-full md:w-48 py-8 rounded-[2.5rem] shadow-xl border border-orange-50 pointer-events-auto transform hover:scale-105 transition-transform text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ZERO</p>
                                <p className="text-xl md:text-2xl font-black text-slate-900">산란촉진제</p>
                            </div>
                        </div>
                    </div>

                    {/* HACCP Info Box */}
                    <div className="max-w-3xl mx-auto bg-orange-100/50 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 border border-white">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl mb-2 shadow-lg shadow-green-500/20">
                                ✓
                            </div>
                            <span className="font-black text-slate-900">HACCP</span>
                        </div>
                        <p className="text-slate-700 font-bold text-lg leading-relaxed text-center md:text-left">
                            에그 120은 <span className="text-orange-600">HACCP인증</span>을 받은 깨끗한 생산시설에서 만든 재료를 바탕으로 <br className="hidden md:block" />
                            자연을 담은 <span className="underline decoration-orange-300 underline-offset-4">동물복지 유황유정란</span>과 함께합니다.
                        </p>
                    </div>
                </div>
            </section>
            {/* NEW: Real Egg Structure Section */}
            <section className="py-32 bg-white overflow-hidden">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
                            <h2 className="text-6xl md:text-8xl font-black text-orange-500 tracking-tighter">Real 계란</h2>
                            <div className="space-y-4">
                                <p className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
                                    통계란이 계란빵 안에 쏙!!! <br />
                                    맛과 영양 어느 하나도 놓치지<br className="md:hidden" />않았어요.
                                </p>
                                <div className="w-20 h-2 bg-orange-500 rounded-full"></div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 pt-8">
                                {[
                                    { title: 'Real 계란모양', desc: '한눈에 봐도 먹음직스러운 리얼한 계란 형태' },
                                    { title: '100% 쌀반죽', desc: '밀가루 없이 속이 편하고 쫄깃한 식감' },
                                    { title: 'Real 통계란', desc: '신선한 통계란 하나가 그대로 들어간 영양 간식' }
                                ].map((point, i) => (
                                    <div key={i} className="flex items-start gap-4 group">
                                        <div className="mt-1.5 w-5 h-5 rounded-full border-4 border-orange-500 group-hover:bg-orange-500 transition-colors"></div>
                                        <div>
                                            <h4 className="text-xl font-black text-slate-900">{point.title}</h4>
                                            <p className="text-slate-500 font-medium">{point.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative animate-in fade-in slide-in-from-right duration-1000 delay-300">
                            <div className="absolute -inset-10 bg-orange-50 rounded-full blur-[100px] opacity-70"></div>
                            <img
                                src="https://github.com/jihoon3813-commits/img_120/blob/main/120egg%20(4)_20.png?raw=true"
                                alt="Real Egg Structure"
                                className="relative w-full h-auto transform hover:scale-105 transition-transform duration-700"
                            />
                            {/* Decorative Sparkles */}
                            <div className="absolute top-10 right-10 text-orange-400 text-4xl animate-pulse">✨</div>
                            <div className="absolute bottom-10 left-10 text-orange-300 text-2xl animate-bounce delay-500">✨</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Menu Lineup Section */}
            <section id="info" className="py-32 bg-slate-50 relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-24 space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900">차별화된 메뉴 라인업</h2>
                        <p className="text-slate-500 text-xl font-medium">취향 저격 프리미엄 디저트를 만나보세요</p>
                        <div className="w-20 h-2 bg-orange-500 mx-auto rounded-full mt-8"></div>
                    </div>

                    <div className="space-y-20">
                        {/* Category 1: Egg Based */}
                        <div>
                            <div className="flex items-center gap-4 mb-10">
                                <span className="text-2xl">🥚</span>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-slate-800">계란이 들어간 리얼 계란빵</h3>
                                    <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">With Whole Premium Egg</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {[
                                    { name: '오리지널', en: 'Original Egg Bread', badges: ['HIT', '통계란 포함'], img: 'https://cdn.imweb.me/upload/S2025012040623186e3bd4/611372b19d376.png' },
                                    { name: '베이컨', en: 'Bacon Egg Bread', badges: ['HIT', '통계란 포함'], img: 'https://cdn.imweb.me/upload/S2025012040623186e3bd4/361fc20931736.png' },
                                    { name: '커스터드', en: 'Custard Egg Bread', badges: ['통계란 포함'], img: 'https://cdn.imweb.me/upload/S2025012040623186e3bd4/5872657a6276b.png' },
                                    { name: '콘버터', en: 'Cone Butter Egg Bread', badges: ['통계란 포함'], img: 'https://cdn.imweb.me/upload/S2025012040623186e3bd4/e9d6dd5517d45.png' }
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-500">
                                        <div className="aspect-square bg-slate-100 relative overflow-hidden">
                                            <img
                                                src={item.img}
                                                alt={item.name}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                            />
                                            {/* Top Left Badges */}
                                            <div className="absolute top-4 left-4 flex flex-wrap gap-1">
                                                {item.badges.map(b => (
                                                    <span key={b} className={`px-2 py-0.5 rounded text-[9px] font-black tracking-tighter ${b === 'HIT' ? 'bg-orange-500 text-white' :
                                                        b === '통계란 포함' ? 'bg-white border border-orange-500 text-orange-500' :
                                                            'bg-green-500 text-white'
                                                        }`}>
                                                        {b}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="p-6 text-center space-y-1">
                                            <h4 className="text-lg font-black text-slate-800">{item.name}</h4>
                                            <p className="text-[10px] text-orange-500/70 font-black uppercase tracking-wide">{item.en}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Category 2: Special Filling */}
                        <div>
                            <div className="flex items-center gap-4 mb-10">
                                <span className="text-2xl">✨</span>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-slate-800">맛있는 속재료 가득 계란빵</h3>
                                    <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Premium Special Fillings</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {[
                                    { name: '팥', en: 'Red Bean Filling Egg Bread', desc: '붕어빵 보다 더 맛있어요' },
                                    { name: '슈크림', en: 'Cream Puff Egg Bread', desc: '십원빵 보다 더 맛있어요' },
                                    { name: '통모짜', en: 'Mozzarella Chunk Egg Bread', badges: ['추천'] },
                                    { name: '로제미트', en: 'Rose Meat Egg Bread' }
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-500">
                                        <div className="aspect-square bg-slate-100 relative overflow-hidden">
                                            {/* Placeholder for menu image */}
                                            <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-bold text-sm italic">
                                                Image Content
                                            </div>
                                            {/* Top Left Badges */}
                                            <div className="absolute top-4 left-4 flex flex-wrap gap-1">
                                                {item.badges?.map(b => (
                                                    <span key={b} className="px-2 py-0.5 rounded text-[9px] font-black tracking-tighter bg-green-500 text-white">
                                                        {b}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="p-6 text-center space-y-1">
                                            <h4 className="text-lg font-black text-slate-800">{item.name}</h4>
                                            <p className="text-[10px] text-orange-500/70 font-black uppercase tracking-wide">{item.en}</p>
                                            {item.desc && <p className="text-[10px] text-slate-400 font-bold mt-1">"{item.desc}"</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Success Points Section */}
            <section id="success" className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                            쉽게 시작하는 샵인샵 <br />
                            <span className="text-orange-500">합리적인 초기 투자비용</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        <div className="group space-y-4 md:space-y-6 p-6 md:p-10 bg-orange-50 rounded-[2.5rem] md:rounded-[3.5rem] border border-orange-100 hover:bg-orange-100 transition-all duration-500">
                            <div className="w-10 h-10 md:w-14 md:h-14 bg-orange-500 text-white rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl font-black shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">01</div>
                            <h3 className="text-xl md:text-2xl font-black text-slate-900">샵인샵 최적화</h3>
                            <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">기존 매장에 그대로, 최소한의 공간으로 설치 가능합니다.</p>
                        </div>
                        <div className="group space-y-4 md:space-y-6 p-6 md:p-10 bg-slate-900 rounded-[2.5rem] md:rounded-[3.5rem] text-white hover:bg-slate-800 transition-all duration-500">
                            <div className="w-10 h-10 md:w-14 md:h-14 bg-white text-slate-900 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl font-black group-hover:scale-110 transition-transform">02</div>
                            <h3 className="text-xl md:text-2xl font-black">소자본 창업</h3>
                            <p className="text-sm md:text-base text-slate-400 font-medium leading-relaxed">거품 없는 비용으로 부담 없이 시작하세요.</p>
                        </div>
                        <div className="group space-y-4 md:space-y-6 p-6 md:p-10 bg-orange-50 rounded-[2.5rem] md:rounded-[3.5rem] border border-orange-100 hover:bg-orange-100 transition-all duration-500">
                            <div className="w-10 h-10 md:w-14 md:h-14 bg-orange-500 text-white rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl font-black shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">03</div>
                            <h3 className="text-xl md:text-2xl font-black">매출 상승 보장</h3>
                            <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">본사의 1:1 밀착 관리로 성공적인 운영을 지원합니다.</p>
                        </div>
                        <div className="group space-y-4 md:space-y-6 p-6 md:p-10 bg-slate-900 rounded-[2.5rem] md:rounded-[3.5rem] text-white hover:bg-slate-800 transition-all duration-500">
                            <div className="w-10 h-10 md:w-14 md:h-14 bg-white text-slate-900 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl font-black group-hover:scale-110 transition-transform">04</div>
                            <h3 className="text-xl md:text-2xl font-black">초고속 조리</h3>
                            <p className="text-sm md:text-base text-slate-400 font-medium leading-relaxed">주문에서 완료까지 단 6분 완성 시스템을 갖췄습니다.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Success Strategy Section (Replaces Media Exposure & Redundant Benefits) */}
            <section className="py-32 bg-slate-50">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16 space-y-6">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900">창업 초보도 <span className="text-orange-500 italic">OK</span></h2>
                        <p className="text-xl text-slate-500 font-bold max-w-2xl mx-auto leading-relaxed">
                            지금 가맹 신청하면 에그120의 <br className="md:hidden" />
                            <span className="text-slate-900 underline decoration-orange-500 decoration-4 underline-offset-8">특급 노하우와 성공 전략을 전수</span><br className="md:hidden" />해드립니다!
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {[
                            { step: 'POINT 1', title: '재료 독점 제공', sub: '매장 경쟁력 상승', icon: '📦' },
                            { step: 'POINT 2', title: '냉동 보관가능 재료', sub: '로스율 ZERO', icon: '❄️' },
                            { step: 'POINT 3', title: '가성·만족 최대', sub: '300% 이상 마진율', icon: '💰' }
                        ].map((p, i) => (
                            <div key={i} className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] shadow-sm border border-gray-100 text-center space-y-3 md:space-y-4 group hover:shadow-2xl transition-all duration-500">
                                <span className="text-3xl md:text-4xl block mb-2 md:mb-4 group-hover:scale-110 transition-transform">{p.icon}</span>
                                <div className="inline-block px-3 py-1 bg-orange-500 text-white text-[9px] md:text-[10px] font-black rounded-full mb-1 md:mb-2">{p.step}</div>
                                <h4 className="text-lg md:text-xl font-black text-slate-800 leading-tight">
                                    {p.title} <br className="hidden md:block" />
                                    {p.sub}
                                </h4>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-8">
                        {/* Delivery Support */}
                        <div className="bg-white rounded-[4rem] p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-500">
                            <div className="flex-1 space-y-6">
                                <span className="text-orange-500 font-black text-sm tracking-widest uppercase">Delivery Strategy</span>
                                <h3 className="text-3xl md:text-4xl font-black text-slate-900">배달앱 세팅 지원</h3>
                                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                                    초기 배달앱 세팅, 막막하셨죠? <br />
                                    <span className="font-black text-slate-800">손쉽게 배달 매출을 올릴 수 있는 환경을 구축해드립니다!</span>
                                </p>
                            </div>
                            <div className="flex-1 px-4">
                                <img src="https://cdn.imweb.me/upload/S2025012040623186e3bd4/7c40bc0801867.png" alt="Delivery Apps" className="w-full h-auto max-w-sm mx-auto transform group-hover:scale-105 transition-transform duration-700" />
                            </div>
                        </div>

                        {/* Protection Support */}
                        <div className="bg-white rounded-[4rem] p-10 md:p-16 flex flex-col md:flex-row-reverse items-center gap-12 shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-500">
                            <div className="flex-1 space-y-6">
                                <span className="text-orange-500 font-black text-sm tracking-widest uppercase">Protection Guarantee</span>
                                <h3 className="text-3xl md:text-4xl font-black text-slate-900">가맹점 상권보호</h3>
                                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                                    내 가게 바로 옆에 똑같은 가게? <br />
                                    <span className="font-black text-slate-800">가맹점 간 매장 반경 300미터를 보장하여 과도한 경쟁을 방지합니다.</span>
                                </p>
                            </div>
                            <div className="flex-1 px-4">
                                <img src="http://localhost:5174/assets/images/location_map.png" alt="Location Map" className="w-full h-auto max-w-sm mx-auto rounded-[3rem] shadow-2xl border-4 border-white transform group-hover:scale-105 transition-transform duration-700" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Monthly Sales Booster Package Section */}
            <section className="py-32 bg-slate-50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent"></div>
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 text-orange-600 rounded-full text-xs font-black tracking-widest uppercase mb-2">
                                Monthly Update
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 flex items-center gap-3">
                                이번 달 매출 부스터 패키지 📈
                            </h2>
                            <p className="text-xl text-slate-500 font-bold">
                                시즌별 최적화된 레시피와 마케팅 가이드를 확인하세요.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Recipe Card */}
                        <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/60 border border-slate-100 flex flex-col group transition-all duration-500 hover:-translate-y-2">
                            <div className="p-8 md:p-10 pb-0 flex items-center justify-between">
                                <h3 className="text-2xl font-black text-slate-900">신메뉴 레시피: 6월의 파이</h3>
                                <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-black rounded-lg animate-pulse">NEW</span>
                            </div>
                            <div className="p-8 md:p-10 space-y-8 flex-1">
                                <div className="relative aspect-[16/9] rounded-[2rem] overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop"
                                        alt="Tropical Cream Pie"
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 text-white">
                                        <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80 mb-1">Seasonal Special</p>
                                        <p className="text-2xl font-black">트로피컬 크림 파이</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-xl font-black text-slate-800">여름 한정 '트로피컬 크림 파이'</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-green-50 rounded-lg flex items-center justify-center text-green-500 text-xs">✓</div>
                                            <p className="text-sm font-bold text-slate-600">권장 소비자가: <span className="text-slate-900">4,800원</span></p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 text-xs">✓</div>
                                            <p className="text-sm font-bold text-slate-600">타겟 고객: <span className="text-slate-900">2030 여성, 간식 구매자</span></p>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-sm hover:bg-orange-500 transition-all flex items-center justify-center gap-2 group/btn shadow-xl shadow-slate-900/20">
                                    레시피 다운로드
                                    <svg className="w-4 h-4 transform group-hover/btn:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Marketing Guide Card */}
                        <div className="bg-white rounded-[3rem] p-8 md:p-10 shadow-2xl shadow-slate-200/60 border border-slate-100 flex flex-col group transition-all duration-500 hover:-translate-y-2">
                            <h3 className="text-2xl font-black text-slate-900 mb-10">배달앱 최적화 가이드</h3>

                            <div className="space-y-6 flex-1">
                                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-3 hover:bg-white hover:border-orange-500/30 transition-all cursor-default">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">썸네일 문구 템플릿</p>
                                    <p className="text-base font-black text-slate-800 leading-relaxed">
                                        "한 입의 행복, 120겹의 기적" <br />
                                        <span className="text-orange-500">- 클릭률 15% 상승 효과</span>
                                    </p>
                                </div>

                                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-3 hover:bg-white hover:border-orange-500/30 transition-all cursor-default">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">인기 메뉴 조합</p>
                                    <p className="text-base font-black text-slate-800 leading-relaxed">
                                        에그베이컨 파이 + 아메리카노 SET <br />
                                        <span className="text-orange-500">(할인가 7,500원)</span>
                                    </p>
                                </div>
                            </div>

                            <div className="mt-10">
                                <button className="w-full py-5 bg-orange-500 text-white rounded-[1.5rem] font-black text-sm hover:bg-slate-900 transition-all flex items-center justify-center gap-2 group/btn shadow-xl shadow-orange-500/20">
                                    6월 운영안 확인하기
                                    <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing / Full Package - Subscription Model */}
            <section id="pricing" className="py-32 bg-slate-900 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-orange-500/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                            샵인샵 최초 <span className="text-orange-500"><br className="md:hidden" />멤버십 도입!</span>
                        </h2>
                        <div className="inline-block px-10 py-4 bg-orange-500 rounded-full text-white text-3xl md:text-5xl font-black shadow-2xl shadow-orange-500/20">
                            풀패키지<br className="md:hidden" />월 99,000원
                        </div>
                        <p className="text-slate-400 text-lg font-bold">* 단, 초기 선납금은 있음</p>
                    </div>

                    {/* NEW: Visual Full Package Grid */}
                    <div className="mb-24">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl md:text-4xl font-black text-white italic">
                                샵인샵 <span className="text-orange-500">풀패키지</span>
                            </h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {[
                                { name: '계란빵 머신', img: 'https://cdn.imweb.me/upload/S2025012040623186e3bd4/de0de24474581.png' },
                                { name: '설치 및 교육', img: 'https://cdn.imweb.me/upload/S2025012040623186e3bd4/74d334cf102f9.png' },
                                { name: '배너 및 실외 거치대', img: 'https://cdn.imweb.me/upload/S2025012040623186e3bd4/5e4b732b2a525.png' },
                                { name: '동물복지 유정란', img: 'https://cdn.imweb.me/upload/S2025012040623186e3bd4/8a74051e1c00b.png' },
                                { name: '동물복지 인증판', img: 'https://cdn.imweb.me/upload/S2025012040623186e3bd4/708982d64ac5a.png' },
                                { name: '포장 재료 지원', img: 'https://cdn.imweb.me/upload/S2025012040623186e3bd4/21653d9fde4ec.png' },
                                { name: '배달앱 세팅 지원', img: 'https://cdn.imweb.me/upload/S2025012040623186e3bd4/fcdfa41be6325.png' },
                                { name: '에그120 전용 반죽', img: 'https://cdn.imweb.me/upload/S2025012040623186e3bd4/a33292c245387.png' },
                                { name: '에그120 속재료', img: 'https://cdn.imweb.me/upload/S2025012040623186e3bd4/71211587b1777.png' },
                                { name: '모형 및 미니 쇼케이스', img: 'https://cdn.imweb.me/upload/S2025012040623186e3bd4/d9afe891138ec.png' },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white rounded-3xl overflow-hidden flex flex-col group hover:-translate-y-2 transition-all duration-500 shadow-2xl">
                                    <div className="aspect-[5/4] overflow-hidden bg-slate-50">
                                        <img
                                            src={item.img}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>
                                    <div className="p-4 md:p-5 flex-1 flex items-center justify-center">
                                        <p className="text-slate-900 font-black text-sm leading-tight text-center">
                                            {item.name}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-[2rem] border border-white/10 shadow-3xl bg-white/5 backdrop-blur-md">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-white/10">
                                    <th className="px-8 py-6 text-orange-500 font-black text-lg w-1/4">항목</th>
                                    <th className="px-8 py-6 text-orange-500 font-black text-lg w-2/4">내용</th>
                                    <th className="px-8 py-6 text-orange-500 font-black text-lg w-1/4 text-center">수량</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {[
                                    { item: '에그120 계란빵 전용머신', content: '진짜 계란빵의 형상을 완벽하게 구현, 에그120 독점 제공 머신, 온도센서/타이머 탑재, 1.3kw 저전력, 한틀 10개 동시 생산', qty: '1대' },
                                    { item: '전용 반죽', content: '1봉 5kg 중량, 포장단위: 1Box 3봉 (15kg), 약 720개 생산 가능 분량', qty: '30kg' },
                                    { item: '속재료', content: '스팸 1kg / 커스터드믹스 1kg / 콘버터 1kg / 베이컨 1kg', qty: '각 1ea' },
                                    { item: '유황란', content: '동물복지 유황먹인 유정란', qty: '120ea' },
                                    { item: '홍보용 X배너 (1종)', content: '실내외용 엑스배너 (60x180cm), 주문제작 (4~5일 소요)', qty: '1ea' },
                                    { item: '메뉴판 (1종)', content: '내부용 POP (22x30cm), 주문제작 (4~5일 소요)', qty: '1ea' },
                                    { item: '홍보용 포스터 (3종)', content: '내부용 홍보 포스터 (48x69cm), 주문제작 (4~5일 소요)', qty: '각 1ea' },
                                    { item: '계란빵 모형 (4종)', content: '계란빵 원형 2종 / 단면 2종', qty: '각 1ea' },
                                    { item: '미니쇼케이스', content: '계란빵 모형 커버용 쇼케이스', qty: '1ea' },
                                    { item: '배달앱 셋업', content: '배민, 배달의민족, 쿠팡이츠, 요기요 본사 담당자 파견 제작', qty: '지원' },
                                    { item: '포장 및 부재료', content: '종이봉투(소), 포장 비닐봉투(소), 배달포장용기, 에그120 스티커', qty: '지원' },
                                    { item: '인증판 세트', content: '동물복지 인증판 (POP UP PANEL), 에그120 인증판 (PANEL)', qty: '각 1ea' },
                                    { item: '설치교육', content: '본사 전문가 현장 파견 및 운영 교육', qty: '지원' }
                                ].map((row, idx) => (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                                        <td className="px-8 py-5 text-white font-black">{row.item}</td>
                                        <td className="px-8 py-5 text-slate-400 text-sm font-medium leading-relaxed whitespace-pre-line">{row.content}</td>
                                        <td className="px-8 py-5 text-orange-500 font-black text-center">{row.qty}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Membership Detail & App Section */}
                    <div className="mt-24 space-y-16">
                        <div className="text-center space-y-4">
                            <span className="bg-orange-500/10 text-orange-500 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase border border-orange-500/20">Membership Plan</span>
                            <h3 className="text-4xl md:text-5xl font-black text-white leading-tight">
                                비즈니스+ 멤버십 <br />
                                <span className="text-orange-500 italic">성장 플랜</span>을<br className="md:hidden" />제안합니다.
                            </h3>
                            <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                                운영 비용 절감뿐만 아니라 마케팅 도구와 전문가 컨설팅체계까지 <br className="hidden md:block" />
                                한 번에 누릴 수 있는 대한민국 유일의 멤버십 솔루션입니다.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
                            {/* egg120 Membership Card */}
                            <div className="bg-white rounded-[4rem] overflow-hidden shadow-2xl flex flex-col group transition-all duration-500">
                                <div className="h-64 overflow-hidden relative">
                                    <img src="https://github.com/jihoon3813-commits/img_120/blob/main/%5B%ED%81%AC%EA%B8%B0%EB%B3%80%ED%99%98%5D240503_120%EA%B2%B9%ED%8C%8C%EC%9D%B40928.jpg?raw=true" alt="egg120 Membership" className="w-full h-full object-cover transform scale-110 group-hover:scale-125 transition-transform duration-1000" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                                    <div className="absolute top-8 left-8">
                                        <span className="bg-slate-900 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest">Recommended Plan</span>
                                    </div>
                                </div>
                                <div className="p-10 md:p-14 flex-1 flex flex-col space-y-10">
                                    <div className="space-y-4">
                                        <h4 className="text-3xl font-black text-slate-900">egg120 Membership</h4>
                                        <p className="text-slate-500 font-bold leading-relaxed">
                                            요즘 핫한 에그120을<br className="md:hidden" />부담 없이 도입할 수 있는 <br />
                                            가장 효율적이고<br className="md:hidden" />스마트한 멤버십 상품입니다.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className="bg-slate-100 px-3 py-1 rounded-lg text-[10px] font-black text-slate-400 uppercase">2년 약정</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-6xl font-black text-slate-900 tracking-tighter">99,000</span>
                                            <span className="text-xl font-black text-slate-500">원 / 월</span>
                                        </div>
                                        <p className="text-orange-500 font-black text-sm tracking-wide">X 23회(2~24회)</p>
                                        <div className="bg-orange-50 rounded-[1.5rem] p-5 flex items-start gap-4 border border-orange-100 italic shadow-inner">
                                            <span className="text-orange-500 text-xl">💡</span>
                                            <p className="text-orange-800 text-sm font-bold leading-snug">
                                                최초 1회는<br className="md:hidden" />입회비 포함 100만원 결제 <br />
                                                <span className="text-orange-600/60 font-medium text-xs">매장 셋업 및 초기 재료 몽땅 제공</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 border-t border-slate-100 pt-8">
                                        {[
                                            '샵인샵 풀패키지 완벽 제공',
                                            '머신 코팅 서비스 연 1회(총 2회)',
                                            '비즈니스+ 스마트 APPs 이용',
                                            '리스크 케어 AI 정기 분석 리포트'
                                        ].map((benefit, i) => (
                                            <div key={i} className="flex items-center gap-4 group/item">
                                                <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs shadow-lg shadow-orange-500/20 group-hover/item:scale-110 transition-transform">✓</div>
                                                <span className="font-black text-slate-700">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Membership App Intro Card */}
                            <div className="bg-gradient-to-br from-slate-800 to-slate-950 rounded-[4rem] overflow-hidden flex flex-col text-white shadow-3xl relative border border-white/5">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-500/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>

                                <div className="p-10 md:p-14 space-y-12 relative z-10 flex-1">
                                    <div className="space-y-6">
                                        <span className="text-orange-500 font-black text-[10px] tracking-[0.3em] uppercase">Digital Transformation</span>
                                        <h4 className="text-3xl md:text-5xl font-black leading-tight">
                                            성장을 가속화하는 <br />
                                            <span className="text-orange-500">Business+ Apps</span>
                                        </h4>
                                        <p className="text-slate-400 font-medium leading-relaxed italic">
                                            복잡한 매장 관리는 잊으세요. <br />
                                            모바일 하나로 모든 데이터가 한 눈에 펼쳐집니다.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            {
                                                title: 'AI 스마트 SNS 홍보',
                                                desc: '메뉴명만 입력하면 전문 카피라이터처럼 문구 작성',
                                                icon: (
                                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                                    </svg>
                                                ),
                                                status: 'RUNNING'
                                            },
                                            {
                                                title: 'AI 홍보물 디자인',
                                                desc: '메뉴판, 포스터 디자인 자동 생성',
                                                icon: (
                                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                ),
                                                status: 'Coming Soon'
                                            },
                                            {
                                                title: 'AI 세무 컨설턴트',
                                                desc: '세금 절약 팁과 신고 가이드를 AI 비서가 지원',
                                                icon: (
                                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                ),
                                                status: 'Coming Soon'
                                            },
                                            {
                                                title: 'AI 노무 비서',
                                                desc: '근로계약서 검토 및 노무 상담 연계',
                                                icon: (
                                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                )
                                            }
                                        ].map((app, i) => (
                                            <div key={i} className="bg-white/5 backdrop-blur-md p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-white/10 flex items-center gap-4 md:gap-6 group/app hover:bg-white/10 transition-colors relative overflow-hidden">
                                                <div className="w-10 h-10 md:w-14 md:h-14 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center group-hover/app:scale-110 transition-transform shrink-0">
                                                    <div className="w-5 h-5 md:w-7 md:h-7 flex items-center justify-center">
                                                        {app.icon}
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <h5 className="font-black text-white text-sm md:text-lg truncate">{app.title}</h5>
                                                        {app.status && (
                                                            <span className={`px-1.5 py-0.5 rounded text-[7px] md:text-[8px] font-black uppercase tracking-wider shrink-0 ${app.status === 'RUNNING' ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                                                {app.status}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] md:text-sm text-slate-500 font-medium truncate">{app.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="px-10 pb-10 relative z-10">
                                    <div className="w-full h-24 bg-gradient-to-t from-orange-500/10 to-transparent rounded-t-[3rem] border-t border-x border-white/10 flex items-center justify-center">
                                        <p className="text-white/20 font-black tracking-[1em] text-[10px] uppercase">Mobile Membership App Interface</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Founder's Message Section */}
            <section className="py-32 bg-slate-50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
                    <div className="relative inline-block">
                        <div className="text-6xl md:text-8xl text-orange-500/10 absolute -top-10 -left-10 font-serif leading-none">“</div>
                        <h3 className="text-3xl md:text-5xl font-black text-slate-900 leading-[1.4] md:leading-[1.4] relative z-10">
                            저희가 최초로 샵인샵을 <br />
                            멤버십으로 만든 이유는! <br />
                            <span className="text-orange-500">가맹점 사장님과 함께</span> <br />
                            <span className="text-orange-500">성장하고 성공</span>할 수 있다고 <br />
                            확신하기 때문입니다.
                        </h3>
                        <div className="text-6xl md:text-8xl text-orange-500/10 absolute -bottom-16 -right-10 font-serif leading-none rotate-180">”</div>
                    </div>

                    <div className="space-y-6 max-w-2xl mx-auto pt-8">
                        <p className="text-xl md:text-2xl font-bold text-slate-600 leading-relaxed">
                            요즘같이 힘든 시기일 수록 다른 매장에는 없는 <br className="hidden md:block" />
                            사장님만의 <span className="text-slate-900 underline decoration-orange-500 decoration-4 underline-offset-8">특별한 아이템</span>이<br className="md:hidden" />반드시 필요합니다.
                        </p>
                        <p className="text-2xl md:text-3xl font-black text-slate-900">
                            길거리 간식의<br className="md:hidden" />왕이었던 계란빵으로 <br />
                            <span className="text-orange-500">새로운 기회</span>를 잡아 보세요!
                        </p>
                    </div>

                    <div className="pt-8">
                        <div className="w-16 h-1 bg-orange-500 mx-auto rounded-full"></div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
            </section>

            {/* Consultation Form Section */}
            <section id="consult" className="py-32 bg-white">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-8">
                        <h2 className="text-5xl font-black text-slate-900 leading-tight">지금 바로 <br /><span className="text-orange-500">성공의 기회</span>를 잡으세요.</h2>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">✓</div>
                                <p className="text-lg font-bold text-slate-700">전문가 1:1 맞춤 컨설팅</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">✓</div>
                                <p className="text-lg font-bold text-slate-700">지역 상권 분석 리포트 제공</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">✓</div>
                                <p className="text-lg font-bold text-slate-700">창업 프로모션 혜택 적용</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[4rem] p-10 md:p-16 shadow-4xl border border-gray-100">
                        {formSubmitted ? (
                            <div className="text-center py-20 space-y-6 animate-in fade-in zoom-in">
                                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-5xl">✓</div>
                                <h3 className="text-4xl font-black text-slate-900">신청 완료!</h3>
                                <p className="text-slate-500 text-lg">최대한 빠른 시일 내에 전문가가 연락드리겠습니다.</p>
                                <button onClick={() => setFormSubmitted(false)} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl">확인</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 ml-1 uppercase tracking-widest">성함</label>
                                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-bold text-lg" placeholder="홍길동" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 ml-1 uppercase tracking-widest">연락처</label>
                                    <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-bold text-lg" placeholder="010-0000-0000" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 ml-1 uppercase tracking-widest">업체명 (선택)</label>
                                    <input type="text" value={formData.businessName} onChange={(e) => setFormData({ ...formData, businessName: e.target.value })} className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-bold text-lg" placeholder="카페명 또는 법인명" />
                                </div>
                                <button type="submit" className="w-full py-6 bg-orange-500 text-white rounded-[2rem] font-black text-2xl shadow-3xl shadow-orange-500/40 hover:bg-orange-600 transition-all transform active:scale-95 mt-4">창업 상담 신청하기</button>
                                <p className="text-[11px] text-slate-400 text-center font-bold">개인정보 수집 및 이용에 동의하는 것으로 간주합니다.</p>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* Sticky CTA (Desktop) */}
            <div className="hidden lg:block fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
                <div className="bg-slate-900/90 backdrop-blur-xl px-12 py-4 rounded-full border border-white/10 shadow-4xl flex items-center gap-12 group animate-in slide-in-from-bottom duration-1000">
                    <p className="text-white font-black text-xl italic whitespace-nowrap">지금 가맹 신청하면 <span className="text-orange-500">특급 노하우</span> 전수!</p>
                    <a href="#consult" className="px-8 py-3 bg-orange-500 text-white rounded-full font-black text-sm hover:scale-110 transition-transform">신청하기</a>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-24 bg-slate-50 border-t border-gray-100 px-6">
                <div className="max-w-6xl mx-auto flex flex-col items-center space-y-8">
                    <h2 className="text-2xl font-black text-slate-300 tracking-tighter italic">EGG 120</h2>
                    <div className="text-center space-y-2 text-sm text-slate-400 font-bold">
                        <p>(주)고우웰라이프 | 대표 이사근 |<br className="md:hidden" />사업자번호 787-88-00444</p>
                        <p>샵인샵 입점 상담 : 1588-0883</p>
                        <p className="mt-8 opacity-50 font-medium">© 2026 EGG120 & 120겹파이. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
