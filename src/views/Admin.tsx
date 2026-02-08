import React, { useEffect, useState } from 'react';
import { dbService } from '../services/dbService';
import { User } from '../types';

const Admin: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState({
        openaiApiKey: '',
        googleApiKey: '',
        aiProvider: 'google',
        adminEmail: '',
        adminPassword: ''
    });

    useEffect(() => {
        fetchUsers();
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        const openaiKey = await dbService.getConfig('openai_api_key');
        const googleKey = await dbService.getConfig('google_api_key');
        const aiProvider = await dbService.getConfig('ai_provider');
        const adminEmail = await dbService.getConfig('admin_email');
        const adminPassword = await dbService.getConfig('admin_password');
        setConfig({
            openaiApiKey: openaiKey || '',
            googleApiKey: googleKey || '',
            aiProvider: aiProvider || 'google',
            adminEmail: adminEmail || 'admin@cafe120.com',
            adminPassword: adminPassword || 'admin123'
        });
    };

    const handleSaveConfig = async (key: string, value: string) => {
        await dbService.saveConfig(key, value);
    };

    const handleUpdateAdmin = async () => {
        if (!confirm('관리자 접속 정보를 변경하시겠습니까? 다음 로그인부터 적용됩니다.')) return;
        try {
            await dbService.updateAdmin(config.adminEmail, config.adminPassword);
            alert('관리자 계정 정보가 성공적으로 변경되었습니다.');
        } catch (error) {
            console.error(error);
            alert('변경 중 오류가 발생했습니다.');
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        const data = await dbService.getUsers();
        setUsers(data || []);
        setLoading(false);
    };

    const handleUpdateUser = async () => {
        if (!selectedUser) return;
        if (!confirm('회원 정보를 수정하시겠습니까?')) return;

        await dbService.updateUser(selectedUser._id, {
            name: selectedUser.name,
            businessName: selectedUser.businessName,
            businessNo: selectedUser.businessNo,
            phone: selectedUser.phone,
            membership: selectedUser.membership,
            status: selectedUser.status,
            memo: selectedUser.memo
        });

        alert('토근 회원 정보가 수정되었습니다.');
        setSelectedUser(null);
        fetchUsers();
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        if (!confirm('정말로 이 회원을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;

        await dbService.deleteUser(selectedUser._id);
        alert('회원이 삭제되었습니다.');
        setSelectedUser(null);
        fetchUsers();
    };

    // ... existing fetchUsers ...

    const [activeTab, setActiveTab] = useState<'dashboard' | 'approval' | 'settings'>('dashboard');

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative">
            {/* Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl animate-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-black text-slate-900">회원 상세 관리</h3>
                            <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">이메일 (아이디)</label>
                                <input type="text" value={selectedUser.email} disabled className="w-full p-3 bg-gray-100 rounded-xl text-slate-500 font-bold" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">이름</label>
                                    <input
                                        type="text"
                                        value={selectedUser.name}
                                        onChange={e => setSelectedUser({ ...selectedUser, name: e.target.value })}
                                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-orange-500 outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">연락처</label>
                                    <input
                                        type="text"
                                        value={selectedUser.phone || ''}
                                        onChange={e => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-orange-500 outline-none transition"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">상호명</label>
                                    <input
                                        type="text"
                                        value={selectedUser.businessName || ''}
                                        onChange={e => setSelectedUser({ ...selectedUser, businessName: e.target.value })}
                                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-orange-500 outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">사업자번호</label>
                                    <input
                                        type="text"
                                        value={selectedUser.businessNo || ''}
                                        onChange={e => setSelectedUser({ ...selectedUser, businessNo: e.target.value })}
                                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-orange-500 outline-none transition"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">멤버십 등급</label>
                                    <select
                                        value={selectedUser.membership}
                                        onChange={e => setSelectedUser({ ...selectedUser, membership: e.target.value })}
                                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-orange-500 outline-none transition"
                                    >
                                        <option value="none">없음</option>
                                        <option value="egg120">egg120</option>
                                        <option value="pie120">pie120</option>
                                        <option value="cafe120">cafe120</option>
                                        <option value="plus">Business+</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">상태 (승인여부)</label>
                                    <select
                                        value={selectedUser.status}
                                        onChange={e => setSelectedUser({ ...selectedUser, status: e.target.value })}
                                        className={`w-full p-3 border rounded-xl focus:border-orange-500 outline-none transition font-bold ${selectedUser.status === 'active' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-orange-50 text-orange-600 border-orange-200'}`}
                                    >
                                        <option value="pending">승인 대기 (Pending)</option>
                                        <option value="active">승인 완료 (Active)</option>
                                        <option value="suspended">이용 정지 (Suspended)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">관리자 메모</label>
                                <textarea
                                    value={selectedUser.memo || ''}
                                    onChange={e => setSelectedUser({ ...selectedUser, memo: e.target.value })}
                                    placeholder="특이사항을 입력하세요."
                                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-orange-500 outline-none transition h-20 resize-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                <button
                                    onClick={handleUpdateUser}
                                    className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-black hover:bg-orange-600 transition shadow-lg"
                                >
                                    변경사항 저장
                                </button>
                                <button
                                    onClick={handleDeleteUser}
                                    className="px-6 py-3 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-100 transition"
                                >
                                    삭제
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900">시스템 관리</h2>
                    <p className="text-slate-500">본사 운영을 위한 관리 도구입니다.</p>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-2xl">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`px-6 py-2 rounded-xl text-sm font-black transition ${activeTab === 'dashboard' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        대시보드
                    </button>
                    <button
                        onClick={() => setActiveTab('approval')}
                        className={`px-6 py-2 rounded-xl text-sm font-black transition ${activeTab === 'approval' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        승인관리
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`px-6 py-2 rounded-xl text-sm font-black transition ${activeTab === 'settings' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        설정
                    </button>
                </div>
            </header>

            {activeTab === 'dashboard' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-black text-slate-900">현황 개요</h3>
                        <button
                            onClick={fetchUsers}
                            className="p-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition text-sm font-bold"
                        >
                            🔄 새로고침
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { label: '전체 멤버십 회원', value: users.length, color: 'blue' },
                            { label: '승인 대기', value: users.filter(u => u.status === 'pending').length, color: 'orange' },
                            { label: '베이직 멤버십', value: users.filter(u => u.membership === 'basic').length, color: 'slate' },
                            { label: '플러스 멤버십', value: users.filter(u => u.membership === 'plus').length, color: 'orange' },
                        ].map(stat => (
                            <div key={stat.label} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                                <p className="text-sm font-bold text-slate-500 mb-1">{stat.label}</p>
                                <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'approval' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-black text-slate-900">회원 승인 및 관리</h3>
                        <button
                            onClick={fetchUsers}
                            className="p-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition text-sm font-bold"
                        >
                            🔄 새로고침
                        </button>
                    </div>
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">이름/상호</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">이메일</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">상태</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">멤버십</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">신청일</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">관리</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {users.map((user, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/50 transition">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-800">{user.name}</div>
                                                <div className="text-xs text-slate-400">{user.businessName}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                                    }`}>
                                                    {user.status === 'active' ? '승인완료' : '승인대기'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-sm font-bold ${user.membership === 'plus' ? 'text-orange-600' : 'text-slate-400'}`}>
                                                    {user.membership.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-400">{user.createdAt}</td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => setSelectedUser(user)}
                                                    className="text-xs font-black text-slate-400 hover:text-orange-600 transition"
                                                >
                                                    관리하기
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-300">
                    {/* Admin Account Section */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <h3 className="text-xl font-black text-slate-900 mb-6 font-primary">본사 관리자 계정 설정</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <label className="block text-xs font-black text-slate-400 uppercase mb-2">관리자 아이디 (이메일)</label>
                                <input
                                    type="text"
                                    value={config.adminEmail}
                                    onChange={(e) => setConfig({ ...config, adminEmail: e.target.value })}
                                    placeholder="admin@example.com"
                                    className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-orange-500 transition-colors text-sm mb-4"
                                />
                            </div>
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <label className="block text-xs font-black text-slate-400 uppercase mb-2">관리자 비밀번호</label>
                                <input
                                    type="password"
                                    value={config.adminPassword}
                                    onChange={(e) => setConfig({ ...config, adminPassword: e.target.value })}
                                    placeholder="비밀번호 입력"
                                    className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-orange-500 transition-colors text-sm mb-4"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleUpdateAdmin}
                                className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black hover:bg-orange-600 transition shadow-lg text-sm"
                            >
                                관리자 계정 정보 저장
                            </button>
                        </div>
                    </div>

                    {/* API Config Section */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <h3 className="text-xl font-black text-slate-900 mb-6">시스템 API 설정</h3>

                        <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <label className="block text-sm font-black text-slate-800 mb-4 uppercase">메인 AI 엔진 선택</label>
                            <div className="flex gap-4">
                                <label className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${config.aiProvider === 'google' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="aiProvider"
                                            value="google"
                                            checked={config.aiProvider === 'google'}
                                            onChange={(e) => {
                                                setConfig({ ...config, aiProvider: e.target.value });
                                                handleSaveConfig('ai_provider', e.target.value);
                                            }}
                                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <div>
                                            <p className="font-bold text-slate-900">Google Gemini</p>
                                            <p className="text-xs text-slate-500">Gemini 1.5 + Imagen 3 (텍스트/이미지 통합)</p>
                                        </div>
                                    </div>
                                </label>
                                <label className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${config.aiProvider === 'openai' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="aiProvider"
                                            value="openai"
                                            checked={config.aiProvider === 'openai'}
                                            onChange={(e) => {
                                                setConfig({ ...config, aiProvider: e.target.value });
                                                handleSaveConfig('ai_provider', e.target.value);
                                            }}
                                            className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                                        />
                                        <div>
                                            <p className="font-bold text-slate-900">OpenAI (GPT-4)</p>
                                            <p className="text-xs text-slate-500">GPT-4o + DALL-E 3 (텍스트/이미지 통합)</p>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className={`bg-gray-50 p-6 rounded-2xl border border-gray-100 transition-opacity ${config.aiProvider === 'google' ? 'opacity-100 ring-2 ring-indigo-500/20' : 'opacity-40 grayscale'}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <label className="block text-xs font-black text-slate-400 uppercase">Google Gemini API Key</label>
                                    <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-1 rounded font-bold">텍스트 + 이미지 (Imagen)</span>
                                </div>
                                <input
                                    type="password"
                                    value={config.googleApiKey}
                                    onChange={(e) => setConfig({ ...config, googleApiKey: e.target.value })}
                                    placeholder="Alza..."
                                    disabled={config.aiProvider !== 'google'}
                                    className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-indigo-500 transition-colors font-mono text-sm mb-4 disabled:bg-gray-100"
                                />
                                <button
                                    onClick={() => handleSaveConfig('google_api_key', config.googleApiKey)}
                                    disabled={config.aiProvider !== 'google'}
                                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition text-sm disabled:opacity-50"
                                >
                                    Gemini 키 저장
                                </button>
                            </div>

                            <div className={`bg-gray-50 p-6 rounded-2xl border border-gray-100 transition-opacity ${config.aiProvider === 'openai' ? 'opacity-100 ring-2 ring-orange-500/20' : 'opacity-40 grayscale'}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <label className="block text-xs font-black text-slate-400 uppercase">OpenAI API Key</label>
                                    <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-1 rounded font-bold">텍스트 + 이미지 (DALL-E)</span>
                                </div>
                                <input
                                    type="password"
                                    value={config.openaiApiKey}
                                    onChange={(e) => setConfig({ ...config, openaiApiKey: e.target.value })}
                                    placeholder="sk-..."
                                    disabled={config.aiProvider !== 'openai'}
                                    className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-orange-500 transition-colors font-mono text-sm mb-4 disabled:bg-gray-100"
                                />
                                <button
                                    onClick={() => handleSaveConfig('openai_api_key', config.openaiApiKey)}
                                    disabled={config.aiProvider !== 'openai'}
                                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition text-sm disabled:opacity-50"
                                >
                                    OpenAI 키 저장
                                </button>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-6 text-center">* 입력된 API Key는 안전하게 암호화되어 저장되며 서비스 운영 목적으로만 사용됩니다.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
