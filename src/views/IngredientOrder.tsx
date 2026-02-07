import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';

interface Ingredient {
    _id: string;
    category: string;
    name: string;
    price: number;
    thumbnail: string;
    detailImage?: string;
    unit: string;
    minQuantity: number;
    shippingFee: number;
    active: boolean;
}

interface CartItem extends Ingredient {
    quantity: number;
}

const IngredientOrder: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'shop' | 'cart' | 'history'>('shop');
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [user, setUser] = useState<any>(null);

    // Order Form State
    const [orderForm, setOrderForm] = useState({
        recipient: '',
        phone: '',
        address: '',
        detailAddress: '',
        message: ''
    });

    useEffect(() => {
        // Load Daum Postcode script
        const script = document.createElement('script');
        script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.async = true;
        document.body.appendChild(script);

        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
            const u = JSON.parse(userStr);
            setUser(u);
            setOrderForm(prev => ({
                ...prev,
                recipient: u.name || '',
                phone: u.phone || '',
                address: u.address || '',
                detailAddress: u.detailAddress || ''
            }));
        }

        // Load cart from local storage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) setCart(JSON.parse(savedCart));

        fetchIngredients();
        if (userStr) fetchOrders(JSON.parse(userStr).email);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const fetchIngredients = async () => {
        setLoading(true);
        const data = await dbService.getIngredients(selectedCategory === 'all' ? undefined : selectedCategory);
        setIngredients(data);
        setLoading(false);
    };

    const fetchOrders = async (userId: string) => {
        const data = await dbService.getOrders(userId);
        setOrders(data);
    };

    useEffect(() => {
        fetchIngredients();
    }, [selectedCategory]);

    const addToCart = (item: Ingredient) => {
        setCart(prev => {
            const existing = prev.find(i => i._id === item._id);
            if (existing) {
                return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: item.minQuantity || 1 }];
        });
        alert('장바구니에 담겻습니다.');
    };

    const updateCartQty = (id: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item._id === id) {
                const newQty = Math.max(item.minQuantity || 1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item._id !== id));
    };

    const handleOrder = async () => {
        if (!user) return alert('로그인이 필요합니다.');
        if (cart.length === 0) return alert('장바구니가 비어있습니다.');
        if (!orderForm.recipient || !orderForm.address || !orderForm.phone) {
            return alert('배송지 정보를 모두 입력해주세요.');
        }

        if (!confirm('주문하시겠습니까? (결제는 시뮬레이션입니다)')) return;

        setLoading(true);
        const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shippingFee = cart.reduce((max, item) => Math.max(max, item.shippingFee || 0), 0); // Simple logic: max fee

        // Prepare order data
        const orderData = {
            userId: user.email,
            items: JSON.stringify(cart.map(i => ({
                id: i._id,
                name: i.name,
                quantity: i.quantity,
                price: i.price,
                unit: i.unit
            }))),
            totalAmount: totalAmount + shippingFee,
            shippingFee,
            recipient: orderForm.recipient,
            address: `${orderForm.address} ${orderForm.detailAddress}`,
            phone: orderForm.phone,
            message: orderForm.message
        };

        try {
            await dbService.createOrder(orderData);
            alert('주문이 완료되었습니다.');
            setCart([]);
            localStorage.removeItem('cart');
            setActiveTab('history');
            fetchOrders(user.email);
        } catch (e) {
            console.error(e);
            alert('주문 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        { id: 'all', name: '전체' },
        { id: 'mix', name: '반죽/파우더' },
        { id: 'filling', name: '속재료/토핑' },
        { id: 'packaging', name: '포장용기/봉투' },
        { id: 'promo', name: '홍보물/배너' },
        { id: 'machine', name: '기기/부품' }
    ];

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9]/g, '');
        let formatted = raw;
        if (raw.length < 4) {
            formatted = raw;
        } else if (raw.length < 8) {
            formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
        } else {
            formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
        }
        setOrderForm({ ...orderForm, phone: formatted.slice(0, 13) });
    };

    const handleSearchAddress = () => {
        // @ts-ignore
        if (!window.daum || !window.daum.Postcode) {
            alert("주소 검색 스크립트가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
            return;
        }
        // @ts-ignore
        new window.daum.Postcode({
            oncomplete: function (data: any) {
                let roadAddr = data.roadAddress; // 도로명 주소 변수
                let extraRoadAddr = ''; // 참고 항목 변수

                if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                    extraRoadAddr += data.bname;
                }
                if (data.buildingName !== '' && data.apartment === 'Y') {
                    extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                if (extraRoadAddr !== '') {
                    roadAddr += ' (' + extraRoadAddr + ')';
                }

                setOrderForm(prev => ({
                    ...prev,
                    address: roadAddr,
                    detailAddress: '' // Reset detail address
                }));
            }
        }).open();
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-900">재료 주문 🛒</h2>
                    <p className="text-slate-500 mt-2">매장 운영에 필요한 식자재와 비품을 간편하게 주문하세요.</p>
                </div>
                <div className="flex gap-2 bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
                    <button
                        onClick={() => setActiveTab('shop')}
                        className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'shop' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-gray-50'}`}
                    >
                        상품 목록
                    </button>
                    <button
                        onClick={() => setActiveTab('cart')}
                        className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'cart' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-gray-50'}`}
                    >
                        장바구니 ({cart.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'history' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-gray-50'}`}
                    >
                        주문 내역
                    </button>
                </div>
            </header>

            {/* SHOP TAB */}
            {activeTab === 'shop' && (
                <div className="space-y-6">
                    {/* Categories */}
                    <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-5 py-2.5 rounded-full font-black text-sm whitespace-nowrap transition-all ${selectedCategory === cat.id
                                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                                    : 'bg-white border border-gray-100 text-slate-500 hover:border-orange-200 hover:text-orange-500'}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="text-center py-20"><div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div></div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {ingredients.map(item => (
                                <div key={item._id} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-xl transition-all group hover:-translate-y-1">
                                    <div className="aspect-square bg-slate-50 relative overflow-hidden">
                                        {item.thumbnail ? (
                                            <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">No Image</div>
                                        )}
                                        {item.shippingFee === 0 && (
                                            <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-black">무료배송</span>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <p className="text-xs font-bold text-slate-400 mb-1">{categories.find(c => c.id === item.category)?.name}</p>
                                        <h3 className="text-lg font-black text-slate-900 mb-2 truncate">{item.name}</h3>
                                        <div className="flex items-end justify-between mb-4">
                                            <div>
                                                <p className="text-xl font-black text-slate-900">{item.price.toLocaleString()}원</p>
                                                <p className="text-xs text-slate-400">/ {item.unit}</p>
                                            </div>
                                            <p className="text-xs font-medium text-slate-400">최소 {item.minQuantity}{item.unit}</p>
                                        </div>
                                        <button
                                            onClick={() => addToCart(item)}
                                            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-orange-500 transition-colors shadow-lg shadow-slate-900/10"
                                        >
                                            담기
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* CART TAB */}
            {activeTab === 'cart' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-black text-slate-900 mb-6">주문 상품 ({cart.length})</h3>
                            {cart.length === 0 ? (
                                <p className="text-center py-10 text-slate-400">장바구니가 비어있습니다.</p>
                            ) : (
                                <div className="space-y-4">
                                    {cart.map(item => (
                                        <div key={item._id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-gray-100">
                                            <div className="w-20 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0">
                                                <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-slate-400 mb-1">{categories.find(c => c.id === item.category)?.name}</p>
                                                <h4 className="text-base font-black text-slate-900 truncate">{item.name}</h4>
                                                <p className="text-sm font-bold text-slate-700">{item.price.toLocaleString()}원</p>
                                            </div>
                                            <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-gray-200">
                                                <button onClick={() => updateCartQty(item._id, -1)} className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-gray-100 rounded">-</button>
                                                <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                                                <button onClick={() => updateCartQty(item._id, 1)} className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-gray-100 rounded">+</button>
                                            </div>
                                            <button onClick={() => removeFromCart(item._id)} className="p-2 text-slate-400 hover:text-red-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-black text-slate-900 mb-6">배송지 정보</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">수령인</label>
                                    <input
                                        type="text"
                                        value={orderForm.recipient}
                                        onChange={(e) => setOrderForm({ ...orderForm, recipient: e.target.value })}
                                        className="w-full p-3 bg-slate-50 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:border-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">연락처</label>
                                    <input
                                        type="tel"
                                        inputMode="numeric"
                                        value={orderForm.phone}
                                        onChange={handlePhoneChange}
                                        maxLength={13}
                                        className="w-full p-3 bg-slate-50 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:border-orange-500"
                                        placeholder="010-0000-0000"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-slate-500 mb-1">주소</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={orderForm.address}
                                        onClick={handleSearchAddress}
                                        className="flex-1 p-3 bg-slate-50 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:border-orange-500 cursor-pointer"
                                        placeholder="주소 검색 (클릭)"
                                    />
                                    <button
                                        onClick={handleSearchAddress}
                                        className="px-4 bg-slate-900 text-white rounded-xl font-bold text-sm whitespace-nowrap hover:bg-slate-800"
                                    >
                                        검색
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={orderForm.detailAddress}
                                    onChange={(e) => setOrderForm({ ...orderForm, detailAddress: e.target.value })}
                                    className="w-full p-3 bg-slate-50 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:border-orange-500"
                                    placeholder="상세 주소"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">배송 메모</label>
                                <input
                                    type="text"
                                    value={orderForm.message}
                                    onChange={(e) => setOrderForm({ ...orderForm, message: e.target.value })}
                                    className="w-full p-3 bg-slate-50 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:border-orange-500"
                                    placeholder="예: 문 앞에 놓아주세요."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-slate-900 rounded-[2rem] p-8 text-white sticky top-24">
                            <h3 className="text-xl font-black mb-6">결제 금액</h3>
                            <div className="space-y-4 mb-8 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">총 상품금액</span>
                                    <span>{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}원</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">배송비</span>
                                    <span>{cart.length > 0 ? (cart.reduce((max, item) => Math.max(max, item.shippingFee || 0), 0) || 0).toLocaleString() : 0}원</span>
                                </div>
                                <div className="border-t border-white/10 pt-4 flex justify-between items-end">
                                    <span className="text-lg font-bold">최종 결제 금액</span>
                                    <span className="text-2xl font-black text-orange-500">
                                        {(
                                            cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) +
                                            (cart.length > 0 ? (cart.reduce((max, item) => Math.max(max, item.shippingFee || 0), 0) || 0) : 0)
                                        ).toLocaleString()}원
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={handleOrder}
                                disabled={loading || cart.length === 0}
                                className="w-full py-4 bg-orange-500 text-white rounded-xl font-black text-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? '처리 중...' : '결제하기'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* HISTORY TAB */}
            {activeTab === 'history' && (
                <div className="space-y-6">
                    {orders.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100">
                            <p className="text-slate-400 text-lg">주문 내역이 없습니다.</p>
                        </div>
                    ) : (
                        orders.map((order, idx) => (
                            <div key={idx} className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:border-orange-200 transition-colors">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-gray-100 gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-sm font-bold text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                                            <span className={`px-2 py-0.5 rounded textxs font-black uppercase ${order.status === 'ordered' ? 'bg-yellow-100 text-yellow-700' :
                                                order.status === 'shipping' ? 'bg-blue-100 text-blue-700' :
                                                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                        'bg-gray-100 text-gray-500'
                                                }`}>
                                                {order.status === 'ordered' ? '주문완료' :
                                                    order.status === 'shipping' ? '배송중' :
                                                        order.status === 'completed' ? '배송완료' : '취소됨'}
                                            </span>
                                        </div>
                                        <p className="text-lg font-black text-slate-900">주문번호: {order._id.slice(-6).toUpperCase()}</p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        {order.trackingNumber && (
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-slate-500">운송장번호</p>
                                                <a href={`https://search.naver.com/search.naver?query=${order.trackingNumber}`} target="_blank" rel="noreferrer" className="text-blue-600 font-bold underline">
                                                    {order.trackingNumber} (조회)
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-3 mb-6">
                                    {JSON.parse(order.items).map((item: any, i: number) => (
                                        <div key={i} className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                                <span className="text-slate-700 font-medium">{item.name}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-slate-400">{item.quantity}{item.unit}</span>
                                                <span className="font-bold text-slate-900">{(item.price * item.quantity).toLocaleString()}원</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-dashed border-gray-200">
                                    <span className="text-sm font-bold text-slate-500">총 결제금액</span>
                                    <span className="text-xl font-black text-orange-500">{order.totalAmount.toLocaleString()}원</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default IngredientOrder;
