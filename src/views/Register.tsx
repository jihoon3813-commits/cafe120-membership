import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';

interface RegisterProps {
    onSuccess: () => void;
}

declare global {
    interface Window {
        daum: any;
    }
}

const Register: React.FC<RegisterProps> = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        phone: '',
        businessName: '',
        businessNo: '',
        address: '',
        detailAddress: '',
        membershipType: 'egg120', // Default selection
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        // Daum 우편번호 서비스 스크립트 로드
        if (!document.querySelector('script[src*="postcode.v2.js"]')) {
            const script = document.createElement('script');
            script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    const handleAddressSearch = () => {
        new window.daum.Postcode({
            oncomplete: (data: any) => {
                let addr = '';
                if (data.userSelectedType === 'R') {
                    addr = data.roadAddress;
                } else {
                    addr = data.jibunAddress;
                }
                setFormData({ ...formData, address: addr });
                setTimeout(() => {
                    document.getElementById('user_addr_detail_field')?.focus();
                }, 100);
            }
        }).open();
    };

    const formatPhone = (value: string) => {
        const nums = value.replace(/[^\d]/g, '');
        if (nums.length <= 3) return nums;
        if (nums.length <= 7) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
        return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7, 11)}`;
    };

    const formatBusinessNo = (value: string) => {
        const nums = value.replace(/[^\d]/g, '');
        if (nums.length <= 3) return nums;
        if (nums.length <= 5) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
        return `${nums.slice(0, 3)}-${nums.slice(3, 5)}-${nums.slice(5, 10)}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setMessage('비밀번호가 일치하지 않습니다.');
            return;
        }

        setLoading(true);
        const { confirmPassword, ...registerData } = formData;
        const result = await dbService.register(registerData);
        setLoading(false);

        if (result.success) {
            alert('멤버십 신청이 완료되었습니다. 관리자 승인 후 로그인이 가능합니다.');
            onSuccess();
        } else {
            setMessage(result.message || '신청 중 오류가 발생했습니다.');
        }
    };

    const membershipPlans = [
        { id: 'egg120', name: 'egg120', price: '99,000원', color: 'bg-orange-50 text-orange-600' },
        { id: 'pie120', name: 'pie120', price: '129,000원', color: 'bg-orange-100 text-orange-700' },
        { id: 'cafe120', name: 'cafe120', price: '199,000원', color: 'bg-slate-900 text-white' }
    ];

    return (
        <div className="max-w-2xl mx-auto mt-8 p-10 bg-white rounded-[2.5rem] shadow-xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center mb-10">
                <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-xs font-black rounded-full mb-4">MEMBERSHIP APPLICATION</span>
                <h2 className="text-3xl font-black text-slate-900 mb-2">멤버십 신청 안내</h2>
                <p className="text-slate-500">cafe120 비즈니스+ 멤버십의 가족이 되어보세요.</p>
            </div>

            {message && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-100">
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Membership Selection */}
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-4 ml-1">신청하실 멤버십 종류</label>
                    <div className="grid grid-cols-3 gap-3">
                        {membershipPlans.map((plan) => (
                            <div
                                key={plan.id}
                                onClick={() => setFormData({ ...formData, membershipType: plan.id })}
                                className={`cursor-pointer p-4 rounded-2xl border-2 transition-all text-center ${formData.membershipType === plan.id
                                    ? 'border-orange-500 ring-2 ring-orange-100'
                                    : 'border-gray-50 hover:border-orange-200'
                                    }`}
                            >
                                <div className={`text-[10px] font-black uppercase mb-1 px-2 py-0.5 rounded-full inline-block ${plan.color}`}>
                                    {plan.name}
                                </div>
                                <div className="text-sm font-black text-slate-900 mt-1">{plan.price}</div>
                            </div>
                        ))}
                    </div>
                    <p className="mt-4 text-xs text-orange-600 font-bold bg-orange-50 p-3 rounded-xl flex items-center gap-2">
                        <span>💡</span> 멤버십 결제는 최종 승인 후, 별도 계약을 통해 진행됩니다.
                    </p>
                </div>

                <div className="col-span-1 md:col-span-2 mt-4 pt-6 border-t border-gray-50">
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">이메일 (아이디)</label>
                    <input
                        type="email"
                        required
                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                        placeholder="example@email.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
                <div className="relative">
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">비밀번호</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500 transition-colors"
                        >
                            {showPassword ? '🐵' : '🙈'}
                        </button>
                    </div>
                </div>
                <div className="relative">
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">비밀번호 확인</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            className={`w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 outline-none transition-all ${formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword
                                    ? 'ring-2 ring-red-500'
                                    : 'focus:ring-orange-500'
                                }`}
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500 transition-colors"
                        >
                            {showPassword ? '🐵' : '🙈'}
                        </button>
                    </div>
                    {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold italic">비밀번호가 일치하지 않습니다.</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">대표자 성함</label>
                    <input
                        type="text"
                        required
                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                        placeholder="홍길동"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">연락처</label>
                    <input
                        type="tel"
                        inputMode="numeric"
                        required
                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                        placeholder="010-0000-0000"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">상호명</label>
                    <input
                        type="text"
                        required
                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                        placeholder="cafe120 강남점"
                        value={formData.businessName}
                        onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">사업자 등록번호</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        required
                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                        placeholder="000-00-00000"
                        value={formData.businessNo}
                        onChange={e => setFormData({ ...formData, businessNo: formatBusinessNo(e.target.value) })}
                    />
                </div>

                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">사업장 주소</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            readOnly
                            required
                            onClick={handleAddressSearch}
                            className="flex-1 px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all cursor-pointer"
                            placeholder="주소 검색을 클릭하세요"
                            value={formData.address}
                        />
                        <button
                            type="button"
                            onClick={handleAddressSearch}
                            className="px-6 bg-orange-100 text-orange-600 font-bold rounded-2xl hover:bg-orange-200 transition"
                        >
                            주소 검색
                        </button>
                    </div>
                    <textarea
                        id="user_addr_detail_field"
                        name="user_addr_detail_field"
                        autoComplete="new-password"
                        rows={1}
                        className="w-full mt-3 px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-none overflow-hidden"
                        placeholder="상세 주소를 입력하세요"
                        value={formData.detailAddress}
                        onChange={e => setFormData({ ...formData, detailAddress: e.target.value })}
                    />
                </div>

                <div className="col-span-1 md:col-span-2 mt-4 text-center">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-orange-600 transition-all transform active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? '신청 처리 중...' : '멤버십 신청 완료'}
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-6">
                        신청 시 [이용약관] 및 [개인정보 처리방침]에 동의하는 것으로 간주됩니다.
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Register;
