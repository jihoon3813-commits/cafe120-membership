import React, { useState, useEffect } from 'react';
import { Product, Lead } from '../types';
import { dbService } from '../services/dbService';

const ProductManagement: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
    const [activeTab, setActiveTab] = useState<'products' | 'leads'>('products');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [p, l] = await Promise.all([
            dbService.getProducts(),
            dbService.getLeads()
        ]);
        setProducts(p);
        setLeads(l);
    };

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            await dbService.saveProduct(editingProduct);
            setIsEditing(false);
            setEditingProduct(null);
            loadData();
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('랜딩페이지 주소가 복사되었습니다.');
    };

    const getLandingUrl = (id: string) => {
        return `${window.location.origin}/?p=${id}`;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900">상품 관리</h2>
                    <p className="text-slate-500 mt-1">상품 등록 및 광고용 랜딩페이지 관리</p>
                </div>
                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'products' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        상품 목록
                    </button>
                    <button
                        onClick={() => setActiveTab('leads')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'leads' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        상담 신청 현황
                    </button>
                </div>
            </header>

            {activeTab === 'products' ? (
                <div className="space-y-6">
                    <div className="flex justify-end">
                        <button
                            onClick={() => {
                                setEditingProduct({
                                    id: '',
                                    name: '',
                                    description: '',
                                    features: [],
                                    price: '',
                                    installments: '',
                                    initial: '',
                                    image: '',
                                    color: 'orange',
                                    isPremium: false,
                                    active: true
                                });
                                setIsEditing(true);
                            }}
                            className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-slate-800 transition shadow-lg shadow-slate-200"
                        >
                            + 새 상품 등록
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {products.map((product) => (
                            <div key={product.id} className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all duration-300 group">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900">{product.name}</h3>
                                            <p className="text-sm text-slate-400 font-medium">{product.id}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingProduct(product);
                                                setIsEditing(true);
                                            }}
                                            className="p-2 text-slate-400 hover:text-orange-500 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                        <p className="text-xs text-slate-400 font-bold uppercase mb-2 tracking-wider">광고 랜딩페이지 주소</p>
                                        <div className="flex items-center gap-3">
                                            <code className="text-[11px] text-orange-600 bg-orange-50 px-2 py-1 rounded font-mono flex-1 truncate">{getLandingUrl(product.id)}</code>
                                            <button
                                                onClick={() => copyToClipboard(getLandingUrl(product.id))}
                                                className="p-2 bg-white border border-gray-200 rounded-lg text-slate-400 hover:text-orange-600 hover:border-orange-200 transition-all shadow-sm"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                                </svg>
                                            </button>
                                            <a
                                                href={getLandingUrl(product.id)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 bg-slate-900 text-white rounded-lg hover:bg-orange-600 transition-all shadow-md"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-t border-gray-50 mt-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${product.active ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                            <span className="text-xs font-bold text-slate-500">{product.active ? '활성 상태' : '비활성'}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-400 font-bold">월 이용료</p>
                                            <p className="text-lg font-black text-slate-900">{product.price}원</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">날짜</th>
                                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">신청 상품</th>
                                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">신청자/업체명</th>
                                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">연락처</th>
                                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">상태</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {leads.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-medium">신청 내역이 없습니다.</td>
                                    </tr>
                                ) : (
                                    leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((lead) => (
                                        <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-8 py-5 text-sm font-medium text-slate-500">{new Date(lead.createdAt).toLocaleDateString()}</td>
                                            <td className="px-8 py-5">
                                                <span className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-black rounded-lg">{lead.productName}</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <p className="font-bold text-slate-900">{lead.name}</p>
                                                <p className="text-xs text-slate-400">{lead.businessName || '-'}</p>
                                            </td>
                                            <td className="px-8 py-5 text-sm font-medium text-slate-600">{lead.phone}</td>
                                            <td className="px-8 py-5">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${lead.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                    {lead.status === 'completed' ? '상담 완료' : '대기중'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-300">
                        <div className="p-10">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-2xl font-black text-slate-900">상품 정보 설정</h3>
                                <button onClick={() => setIsEditing(false)} className="p-2 text-slate-400 hover:text-slate-600 transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSaveProduct} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 ml-1">상품 ID (영문/숫자)</label>
                                        <input
                                            type="text"
                                            value={editingProduct?.id}
                                            onChange={(e) => setEditingProduct({ ...editingProduct!, id: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-bold"
                                            placeholder="예: pie120-special"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 ml-1">상품명</label>
                                        <input
                                            type="text"
                                            value={editingProduct?.name}
                                            onChange={(e) => setEditingProduct({ ...editingProduct!, name: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-bold"
                                            placeholder="예: 120겹파이 스페셜 에디션"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 ml-1">설명</label>
                                    <textarea
                                        value={editingProduct?.description}
                                        onChange={(e) => setEditingProduct({ ...editingProduct!, description: e.target.value })}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-bold h-24 resize-none"
                                        placeholder="상품에 대한 상세 설명을 입력하세요."
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 ml-1">약정 기간</label>
                                        <input
                                            type="text"
                                            value={editingProduct?.commitment}
                                            onChange={(e) => setEditingProduct({ ...editingProduct!, commitment: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-bold"
                                            placeholder="예: 2년 약정"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 ml-1">월 이용료 (원)</label>
                                        <input
                                            type="text"
                                            value={editingProduct?.price}
                                            onChange={(e) => setEditingProduct({ ...editingProduct!, price: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-bold text-orange-600"
                                            placeholder="예: 129,000"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 ml-1">할부 정보</label>
                                        <input
                                            type="text"
                                            value={editingProduct?.installments}
                                            onChange={(e) => setEditingProduct({ ...editingProduct!, installments: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-bold"
                                            placeholder="예: X 23회(2~24회)"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 ml-1">초기 비용</label>
                                        <input
                                            type="text"
                                            value={editingProduct?.initial}
                                            onChange={(e) => setEditingProduct({ ...editingProduct!, initial: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-bold"
                                            placeholder="예: 최초 1회 입회비 포함 150만원 결제"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 ml-1">이미지 URL</label>
                                    <input
                                        type="text"
                                        value={editingProduct?.image}
                                        onChange={(e) => setEditingProduct({ ...editingProduct!, image: e.target.value })}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-bold"
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="active"
                                            checked={editingProduct?.active}
                                            onChange={(e) => setEditingProduct({ ...editingProduct!, active: e.target.checked })}
                                            className="w-5 h-5 accent-orange-500"
                                        />
                                        <label htmlFor="active" className="text-sm font-black text-slate-700">판매 활성화</label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="premium"
                                            checked={editingProduct?.isPremium}
                                            onChange={(e) => setEditingProduct({ ...editingProduct!, isPremium: e.target.checked })}
                                            className="w-5 h-5 accent-orange-500"
                                        />
                                        <label htmlFor="premium" className="text-sm font-black text-slate-700">프리미엄 뱃지 표시</label>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="flex-1 py-5 rounded-[1.5rem] font-black text-slate-500 bg-gray-100 hover:bg-gray-200 transition"
                                    >
                                        취소
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] py-5 rounded-[1.5rem] font-black text-white bg-orange-500 hover:bg-orange-600 transition shadow-xl shadow-orange-500/20"
                                    >
                                        저장하기
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
