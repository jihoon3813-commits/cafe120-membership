import React, { useEffect, useState } from 'react';
import { dbService } from '../services/dbService';
import { User } from '../types';

const Admin: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        // dbService.getUsers()는 GAS 연동 후 작동
        const data = await dbService.getUsers();
        // Mock data if empty
        if (data.length === 0) {
            setUsers([
                { email: 'user1@example.com', name: '김사장', businessName: '카페에이', status: 'pending', membership: 'none', createdAt: '2024-05-20' },
                { email: 'user2@example.com', name: '이사정', businessName: '카페비', status: 'active', membership: 'basic', createdAt: '2024-05-18' },
                { email: 'admin@cafe120.com', name: '관리자', businessName: '본사', status: 'active', membership: 'plus', role: 'admin', createdAt: '2024-01-01' },
            ]);
        } else {
            setUsers(data);
        }
        setLoading(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-900">총괄 관리자 대시보드</h2>
                    <p className="text-slate-500">멤버십 신청 현황 및 관리를 수행합니다.</p>
                </div>
                <button
                    onClick={fetchUsers}
                    className="p-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition"
                >
                    🔄 새로고침
                </button>
            </header>

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
                                        <button className="text-xs font-black text-slate-400 hover:text-orange-600 transition">관리하기</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Admin;
