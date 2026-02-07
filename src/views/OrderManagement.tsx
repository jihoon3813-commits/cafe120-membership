import React, { useState, useEffect, useRef } from 'react';
import { dbService } from '../services/dbService';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const OrderManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'categories'>('orders');
    // const [orders, setOrders] = useState<any[]>([]); // Replaced with useQuery
    const orders = useQuery(api.shop.getOrders, {}) || [];
    const prevOrdersLength = useRef(0);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Audio for notification
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'); // Simple beep
    }, []);

    useEffect(() => {
        if (orders.length > prevOrdersLength.current && prevOrdersLength.current !== 0) {
            // New order!
            setToastMessage('새로운 주문이 도착했습니다! 🔔');
            if (audioRef.current) {
                audioRef.current.play().catch(e => console.log('Audio play failed', e));
            }
            setTimeout(() => setToastMessage(null), 5000);
        }
        prevOrdersLength.current = orders.length;
    }, [orders]);
    const [ingredients, setIngredients] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Product Form
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [productForm, setProductForm] = useState({
        category: 'mix',
        name: '',
        price: 0,
        thumbnail: '',
        storageId: '',
        unit: 'Box',
        minQuantity: 1,
        shippingFee: 3000,
        active: true
    });
    const [uploading, setUploading] = useState(false);
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

    // Category Form
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        if (activeTab === 'orders') {
            // fetchOrders(); // No need to fetch manually
        }
        else if (activeTab === 'products') {
            fetchIngredients();
            fetchCategories();
        }
        else fetchCategories();
    }, [activeTab]);

    const fetchOrders = async () => {
        // setLoading(true);
        // const data = await dbService.getOrders(); // No userId = all
        // setOrders(data);
        // setLoading(false);
    };

    const fetchIngredients = async () => {
        setLoading(true);
        const data = await dbService.getAllIngredients();
        setIngredients(data);
        setLoading(false);
    };

    const fetchCategories = async () => {
        const data = await dbService.getCategories();
        setCategories(data);
    };

    const handleSaveProduct = async () => {
        if (!productForm.name || !productForm.price) return alert('필수 정보를 입력하세요.');

        try {
            if (editingProduct) {
                await dbService.updateIngredient(editingProduct._id, productForm);
            } else {
                await dbService.addIngredient(productForm);
            }
            setIsProductModalOpen(false);
            setEditingProduct(null);
            fetchIngredients();
        } catch (error) {
            console.error(error);
            alert('저장 중 오류가 발생했습니다.');
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (confirm('정말 삭제하시겠습니까?')) {
            await dbService.deleteIngredient(id);
            fetchIngredients();
        }
    };

    const handleUpdateOrderStatus = async (id: string, status: string, trackingNumber?: string) => {
        await dbService.updateOrderStatus(id, status, trackingNumber);
        // fetchOrders(); // No need to refresh, auto updates
    };

    const openProductModal = (product?: any) => {
        if (product) {
            setEditingProduct(product);
            setProductForm({
                category: product.category,
                name: product.name,
                price: product.price,
                thumbnail: product.thumbnail,
                storageId: product.storageId || '',
                unit: product.unit,
                minQuantity: product.minQuantity,
                shippingFee: product.shippingFee,
                active: product.active
            });
        } else {
            setEditingProduct(null);
            setProductForm({
                category: 'mix',
                name: '',
                price: 0,
                thumbnail: '',
                storageId: '',
                unit: 'Box',
                minQuantity: 1,
                shippingFee: 3000,
                active: true
            });
        }
        setIsProductModalOpen(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            // 1. Get upload URL
            const postUrl = await dbService.generateUploadUrl();

            // 2. Upload file
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });
            const { storageId } = await result.json();

            // 3. Get file URL (Construct it manually or use another query. 
            // For now, convex cloud files are served at specific url pattern or we need a getUrl query.
            // Simplified: we will use a public proxy or just store the storageId and fetch a signed url if needed.
            // BUT: simple way for this demo is just store the storageId and we need a way to view it.
            // Let's assume we can construct a url or use a helper. 
            // Since we don't have getUrl helper in dbService, we will try to use the storageId as the thumbnail for now,
            // but the <img src> won't work with raw storageId.
            // Fix: We need a getUrl query. Let's assume we just use the file URL if we were using S3, 
            // but for Convex Storage we need `convex.storage.getUrl(storageId)`.
            // Let's rely on `thumbnail` being a string. 
            // We'll update the `thumbnail` state with the storageId for now, but in a real app access is via a query.
            // To make it working immediately without extra backend queries for URL signing:
            // We will use the fact that if it is a storageId, the backend `getIngredients` should ideally return a URL.
            // But we didn't implement that in `shop.ts`.
            // Plan B: Just store it. And user sees a placeholder in preview until saved?
            // BETTER PLAN: We will add `thumbnailUrl` to the response in `shop.ts` later if needed, 
            // but for now let's manually construct the URL if we can.
            // Actually, `convex.site` can serve files? 
            // Let's just save `storageId` and also a `thumbnail` which might be empty.
            // Wait, to show the image we NEED a URL.
            // Let's use a temporary URL for preview.
            const previewUrl = URL.createObjectURL(file);
            setProductForm(prev => ({ ...prev, thumbnail: previewUrl, storageId: storageId }));
        } catch (e) {
            console.error(e);
            alert('이미지 업로드 실패');
        } finally {
            setUploading(false);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;
        await dbService.addCategory({ name: newCategoryName, order: categories.length });
        setNewCategoryName('');
        fetchCategories();
    };

    const handleDeleteCategory = async (id: string) => {
        if (confirm('카테고리를 삭제하시겠습니까? 해당 카테고리의 상품들은 분류 미지정이 될 수 있습니다.')) {
            await dbService.deleteCategory(id);
            fetchCategories();
        }
    };

    const onDragStart = (e: React.DragEvent, index: number) => {
        setDraggedItemIndex(index);
        e.dataTransfer.effectAllowed = "move";
        // e.dataTransfer.setDragImage(e.currentTarget, 20, 20); // Optional custom drag image
    };

    const onDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (draggedItemIndex === null || draggedItemIndex === index) return;

        // Visual feedback could be added here
    };

    const onDrop = async (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedItemIndex === null) return;

        const newIngredients = [...ingredients];
        const draggedItem = newIngredients[draggedItemIndex];

        // Remove dragged item
        newIngredients.splice(draggedItemIndex, 1);
        // Insert at new position
        newIngredients.splice(index, 0, draggedItem);

        setIngredients(newIngredients);
        setDraggedItemIndex(null);

        // Save order to backend
        const updates = newIngredients.map((item, idx) => ({
            id: item._id,
            order: idx
        }));
        await dbService.reorderIngredients(updates);
    };

    // const categories = [
    //     { id: 'mix', name: '반죽/파우더' },
    //     { id: 'filling', name: '속재료/토핑' },
    //     { id: 'packaging', name: '포장용기/봉투' },
    //     { id: 'promo', name: '홍보물/배너' },
    //     { id: 'machine', name: '기기/부품' }
    // ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-900">발주/재료 관리 🚚</h2>
                    <p className="text-slate-500 mt-2">가맹점 주문 내역을 관리하고 상품을 등록합니다.</p>
                </div>
                <div className="flex gap-2 bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'orders' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-gray-50'}`}
                    >
                        주문 내역
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'products' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-gray-50'}`}
                    >
                        상품 관리
                    </button>
                    <button
                        onClick={() => setActiveTab('categories')}
                        className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'categories' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-gray-50'}`}
                    >
                        분류 관리
                    </button>
                </div>
            </header>

            {/* TOAST NOTIFICATION */}
            {toastMessage && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
                    <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
                        <span className="text-2xl">🔔</span>
                        <div className="font-bold">{toastMessage}</div>
                    </div>
                </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
                <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-gray-100 text-xs uppercase text-slate-400 font-bold">
                                <tr>
                                    <th className="px-6 py-4">주문번호/일시</th>
                                    <th className="px-6 py-4">가맹점(주문자)</th>
                                    <th className="px-6 py-4">주문내역</th>
                                    <th className="px-6 py-4">금액</th>
                                    <th className="px-6 py-4">상태/송장번호</th>
                                    <th className="px-6 py-4">관리</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map(order => (
                                    <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="block font-bold text-slate-900">{order._id.slice(-6).toUpperCase()}</span>
                                            <span className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{order.recipient}</div>
                                            <div className="text-xs text-slate-500">{order.phone}</div>
                                            <div className="text-xs text-slate-400 truncate max-w-[150px]">{order.address}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1 max-w-[200px]">
                                                {JSON.parse(order.items).map((item: any, i: number) => (
                                                    <div key={i} className="text-sm text-slate-600 truncate">
                                                        {item.name} <span className="text-slate-400">x{item.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-black text-slate-900">
                                            {order.totalAmount.toLocaleString()}원
                                        </td>
                                        <td className="px-6 py-4 space-y-2">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value, order.trackingNumber)}
                                                className={`text-xs font-bold px-2 py-1 rounded border outline-none ${order.status === 'ordered' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                                                    order.status === 'shipping' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                                        order.status === 'completed' ? 'bg-green-50 text-green-600 border-green-200' :
                                                            'bg-gray-50 text-gray-500 border-gray-200'
                                                    }`}
                                            >
                                                <option value="ordered">주문확인</option>
                                                <option value="shipping">배송중</option>
                                                <option value="completed">배송완료</option>
                                                <option value="cancelled">주문취소</option>
                                            </select>
                                            <input
                                                type="text"
                                                defaultValue={order.trackingNumber || ''}
                                                placeholder="송장번호 입력"
                                                className="block w-full text-xs p-1 border border-gray-200 rounded"
                                                onBlur={(e) => {
                                                    if (e.target.value !== order.trackingNumber) {
                                                        handleUpdateOrderStatus(order._id, order.status, e.target.value);
                                                    }
                                                }}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-xs text-slate-400 hover:text-slate-900 underline">상세보기</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* PRODUCTS TAB */}
            {activeTab === 'products' && (
                <div>
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => openProductModal()}
                            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-500 transition-colors shadow-lg"
                        >
                            + 상품 등록
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {ingredients.map((item, index) => (
                            <div
                                key={item._id}
                                draggable
                                onDragStart={(e) => onDragStart(e, index)}
                                onDragOver={(e) => onDragOver(e, index)}
                                onDrop={(e) => onDrop(e, index)}
                                className={`bg-white rounded-[2rem] border border-gray-100 overflow-hidden group hover:shadow-xl transition-all relative cursor-move ${draggedItemIndex === index ? 'opacity-50 border-orange-500 border-2' : ''}`}
                            >
                                <div className="aspect-square bg-slate-50 relative pointer-events-none"> {/* Disable pointer events on image to prevent image drag interference */}
                                    {item.thumbnail ? (
                                        <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-300">No Image</div>
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                                        <button onClick={() => openProductModal(item)} className="bg-white p-2 rounded-full shadow-md text-slate-600 hover:text-blue-500">✏️</button>
                                        <button onClick={() => handleDeleteProduct(item._id)} className="bg-white p-2 rounded-full shadow-md text-slate-600 hover:text-red-500">🗑️</button>
                                    </div>
                                </div>
                                <div className="p-5 pointer-events-none">
                                    <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded mb-2 inline-block">
                                        {categories.find(c => c._id === item.category)?.name || item.category}
                                    </span>
                                    <h3 className="font-bold text-slate-900 mb-1 truncate">{item.name}</h3>
                                    <p className="text-sm text-slate-500">{item.price.toLocaleString()}원 / {item.unit}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* CATEGORIES TAB */}
            {activeTab === 'categories' && (
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">카테고리 관리</h3>
                        <div className="flex gap-2 mb-6">
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="새 카테고리 이름"
                                className="flex-1 p-3 bg-slate-50 rounded-xl border border-gray-200 outline-none"
                            />
                            <button
                                onClick={handleAddCategory}
                                className="px-6 bg-slate-900 text-white rounded-xl font-bold hover:bg-orange-500 transition-colors"
                            >
                                추가
                            </button>
                        </div>
                        <ul className="space-y-2">
                            {categories.map(cat => (
                                <li key={cat._id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                                    <span className="font-bold text-slate-700">{cat.name}</span>
                                    <button onClick={() => handleDeleteCategory(cat._id)} className="text-slate-400 hover:text-red-500">삭제</button>
                                </li>
                            ))}
                            {categories.length === 0 && <li className="text-slate-400 text-center py-4">등록된 카테고리가 없습니다.</li>}
                        </ul>
                    </div>
                </div>
            )}

            {/* PRODUCT MODAL */}
            {isProductModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in zoom-in duration-200">
                        <h3 className="text-2xl font-black text-slate-900 mb-6">{editingProduct ? '상품 수정' : '상품 등록'}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">카테고리</label>
                                <select
                                    value={productForm.category}
                                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                                    className="w-full p-3 bg-slate-50 rounded-xl border border-gray-200 outline-none"
                                >
                                    <option value="">카테고리 선택</option>
                                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">상품명</label>
                                <input
                                    type="text"
                                    value={productForm.name}
                                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                    className="w-full p-3 bg-slate-50 rounded-xl border border-gray-200 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">가격</label>
                                    <input
                                        type="text"
                                        value={productForm.price.toLocaleString()}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, '');
                                            setProductForm({ ...productForm, price: Number(val) });
                                        }}
                                        className="w-full p-3 bg-slate-50 rounded-xl border border-gray-200 outline-none text-right font-mono font-bold text-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">단위</label>
                                    <select
                                        value={productForm.unit}
                                        onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                                        className="w-full p-3 bg-slate-50 rounded-xl border border-gray-200 outline-none"
                                    >
                                        <option value="Box">Box</option>
                                        <option value="kg">kg</option>
                                        <option value="ea">ea</option>
                                        <option value="pack">Pack</option>
                                        <option value="set">Set</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">최소수량</label>
                                    <input
                                        type="number"
                                        value={productForm.minQuantity}
                                        onChange={(e) => setProductForm({ ...productForm, minQuantity: Number(e.target.value) })}
                                        className="w-full p-3 bg-slate-50 rounded-xl border border-gray-200 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">배송비</label>
                                    <select
                                        value={productForm.shippingFee}
                                        onChange={(e) => setProductForm({ ...productForm, shippingFee: Number(e.target.value) })}
                                        className="w-full p-3 bg-slate-50 rounded-xl border border-gray-200 outline-none"
                                    >
                                        <option value={0}>무료배송</option>
                                        <option value={3000}>3,000원</option>
                                        <option value={5000}>5,000원</option>
                                        <option value={10000}>10,000원</option>
                                        <option value={15000}>15,000원</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">상품 이미지</label>
                                <div className="flex items-start gap-4">
                                    <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                                        {productForm.thumbnail ? (
                                            <img src={productForm.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">No Image</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            onChange={handleImageUpload}
                                            className="block w-full text-sm text-slate-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-xs file:font-semibold
                                                file:bg-orange-50 file:text-orange-700
                                                hover:file:bg-orange-100 mb-2
                                            "
                                        />
                                        <input
                                            type="text"
                                            value={productForm.thumbnail}
                                            onChange={(e) => setProductForm({ ...productForm, thumbnail: e.target.value })}
                                            className="w-full p-2 bg-slate-50 rounded-lg border border-gray-200 outline-none text-xs"
                                            placeholder="또는 이미지 URL 직접 입력"
                                        />
                                        {uploading && <p className="text-orange-500 text-xs mt-1 font-bold">이미지 업로드 중...</p>}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-bold text-slate-700">판매 중</label>
                                <input
                                    type="checkbox"
                                    checked={productForm.active}
                                    onChange={(e) => setProductForm({ ...productForm, active: e.target.checked })}
                                    className="w-5 h-5 accent-orange-500"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button onClick={handleSaveProduct} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-black hover:bg-orange-500 transition">저장</button>
                            <button onClick={() => setIsProductModalOpen(false)} className="px-6 py-3 bg-gray-100 text-slate-500 rounded-xl font-bold hover:bg-gray-200 transition">취소</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
