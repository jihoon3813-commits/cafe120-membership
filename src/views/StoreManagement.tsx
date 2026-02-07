import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { Store } from '../types';
import * as XLSX from 'xlsx';

const StoreManagement: React.FC = () => {
    const [stores, setStores] = useState<Store[]>([]);
    const [filteredStores, setFilteredStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    // Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

    const [form, setForm] = useState({
        registrationDate: new Date().toISOString().split('T')[0],
        storeName: '',
        ownerName: '',
        mobilePhone: '',
        storePhone: '',
        email: '',
        status: '영업중' as '영업중' | '폐업' | '계약종료',
        address: '',
        detailAddress: '',
        remarks: ''
    });

    useEffect(() => {
        fetchStores();
        // Load Daum Postcode script if not already loaded
        if (!window.hasOwnProperty('daum')) {
            const script = document.createElement('script');
            script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    useEffect(() => {
        applyFilters();
    }, [stores, searchTerm, statusFilter, dateRange]);

    const fetchStores = async () => {
        setLoading(true);
        try {
            const data = await dbService.getStores();
            setStores(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let result = [...stores];

        if (searchTerm) {
            const lowSearch = searchTerm.toLowerCase();
            result = result.filter(s =>
                s.storeName.toLowerCase().includes(lowSearch) ||
                s.ownerName.toLowerCase().includes(lowSearch) ||
                s.mobilePhone.includes(searchTerm) ||
                s.email.toLowerCase().includes(lowSearch)
            );
        }

        if (statusFilter !== 'all') {
            result = result.filter(s => s.status === statusFilter);
        }

        if (dateRange.start) {
            result = result.filter(s => s.registrationDate >= dateRange.start);
        }
        if (dateRange.end) {
            result = result.filter(s => s.registrationDate <= dateRange.end);
        }

        setFilteredStores(result);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'mobilePhone' | 'storePhone') => {
        const raw = e.target.value.replace(/[^0-9]/g, '');
        let formatted = raw;
        if (raw.length < 4) {
            formatted = raw;
        } else if (raw.length < 8) {
            formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
        } else {
            // For mobile 010-XXXX-XXXX, for tell 02-XXX-XXXX or 031-XXX-XXXX
            // Simplistic auto-hyphen for now
            if (raw.length <= 10) {
                formatted = `${raw.slice(0, 3)}-${raw.slice(3, 6)}-${raw.slice(6)}`;
            } else {
                formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
            }
        }
        setForm({ ...form, [field]: formatted.slice(0, 13) });
    };

    const handleSearchAddress = () => {
        // @ts-ignore
        new window.daum.Postcode({
            oncomplete: function (data: any) {
                setForm(prev => ({
                    ...prev,
                    address: data.roadAddress,
                    detailAddress: ''
                }));
            }
        }).open();
    };

    const handleSave = async () => {
        if (!form.storeName || !form.ownerName || !form.mobilePhone) {
            return alert('필수 정보를 입력하세요.');
        }
        try {
            await dbService.addStore(form);
            setIsAddModalOpen(false);
            setForm({
                registrationDate: new Date().toISOString().split('T')[0],
                storeName: '',
                ownerName: '',
                mobilePhone: '',
                storePhone: '',
                email: '',
                status: '영업중',
                address: '',
                detailAddress: '',
                remarks: ''
            });
            fetchStores();
        } catch (e) {
            alert('저장 오류');
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) return;
        if (confirm(`선택한 ${selectedIds.length}개의 매장을 삭제하시겠습니까?`)) {
            await dbService.deleteStores(selectedIds);
            setSelectedIds([]);
            fetchStores();
        }
    };

    const downloadTemplate = () => {
        const wsData = [
            ["등록일(YYYY-MM-DD)", "매장명", "점주명", "핸드폰(010-0000-0000)", "매장번호", "이메일", "운영여부(영업중/폐업/계약종료)", "주소", "상세주소", "비고"],
            ["2026-02-07", "카페120 강남점", "김철수", "010-1234-5678", "02-123-4567", "gangnam@cafe120.com", "영업중", "서울 강남구 테헤란로 1", "120층", "우수 매장"],
            ["2026-02-01", "키친120 홍대점", "이영희", "010-9876-5432", "02-987-6543", "hongdae@cafe120.com", "영업중", "서울 마포구 와우산로 1", "1층", ""]
        ];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "매장등록양식");
        XLSX.writeFile(wb, "매장_일괄등록_양식.xlsx");
    };

    const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (evt) => {
            const bstr = evt.target?.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 });

            // Skip header
            const rows = data.slice(1).filter(row => row.length >= 3);
            const storesToUpload = rows.map(row => ({
                registrationDate: String(row[0] || new Date().toISOString().split('T')[0]),
                storeName: String(row[1] || ''),
                ownerName: String(row[2] || ''),
                mobilePhone: String(row[3] || ''),
                storePhone: String(row[4] || ''),
                email: String(row[5] || ''),
                status: (row[6] === '폐업' ? '폐업' : row[6] === '계약종료' ? '계약종료' : '영업중') as any,
                address: String(row[7] || ''),
                detailAddress: String(row[8] || ''),
                remarks: String(row[9] || '')
            }));

            if (storesToUpload.length > 0) {
                if (confirm(`${storesToUpload.length}개의 매장을 등록하시겠습니까?`)) {
                    await dbService.bulkAddStores(storesToUpload);
                    alert('등록 완료');
                    setIsBulkModalOpen(false);
                    fetchStores();
                }
            } else {
                alert('등록할 데이터가 없습니다.');
            }
        };
        reader.readAsBinaryString(file);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900">매장 관리 🏢</h2>
                    <p className="text-slate-500 mt-2">전국 매장의 현황을 실시간으로 관리하고 분석합니다.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsBulkModalOpen(true)}
                        className="bg-white border border-gray-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition shadow-sm"
                    >
                        일괄 등록
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-orange-500 transition shadow-lg"
                    >
                        + 신규 매장 등록
                    </button>
                </div>
            </header>

            {/* FILTERS */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">매장명/점주명 검색</label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="검색어를 입력하세요..."
                        className="w-full p-3 bg-slate-50 rounded-xl border border-gray-100 outline-none focus:border-orange-500 transition"
                    />
                </div>
                <div className="w-32">
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">운영 여부</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full p-3 bg-slate-50 rounded-xl border border-gray-100 outline-none focus:border-orange-500 transition font-bold text-sm"
                    >
                        <option value="all">전체</option>
                        <option value="영업중">영업중</option>
                        <option value="폐업">폐업</option>
                        <option value="계약종료">계약종료</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    <div className="w-36">
                        <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">시작 기간</label>
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                            className="w-full p-3 bg-slate-50 rounded-xl border border-gray-100 outline-none text-sm"
                        />
                    </div>
                    <div className="w-36">
                        <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">종료 기간</label>
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                            className="w-full p-3 bg-slate-50 rounded-xl border border-gray-100 outline-none text-sm"
                        />
                    </div>
                </div>
                <button
                    onClick={() => { setSearchTerm(''); setStatusFilter('all'); setDateRange({ start: '', end: '' }); }}
                    className="p-3 text-slate-400 hover:text-slate-900 transition"
                >
                    🔄 초기화
                </button>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-600">총 {filteredStores.length}개 매장</span>
                        {selectedIds.length > 0 && (
                            <span className="text-sm text-orange-600 font-bold ml-2">({selectedIds.length}개 선택됨)</span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {selectedIds.length > 0 && (
                            <button
                                onClick={handleDeleteSelected}
                                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition"
                            >
                                선택 삭제
                            </button>
                        )}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-gray-100 text-[10px] uppercase text-slate-400 font-black">
                            <tr>
                                <th className="px-6 py-4 w-10">
                                    <input
                                        type="checkbox"
                                        onChange={(e) => setSelectedIds(e.target.checked ? filteredStores.map(s => s._id) : [])}
                                        checked={selectedIds.length === filteredStores.length && filteredStores.length > 0}
                                        className="w-4 h-4 accent-orange-500 rounded"
                                    />
                                </th>
                                <th className="px-6 py-4">등록일</th>
                                <th className="px-6 py-4">매장명</th>
                                <th className="px-6 py-4">점주명</th>
                                <th className="px-6 py-4">연락처</th>
                                <th className="px-6 py-4">이메일</th>
                                <th className="px-6 py-4">상태</th>
                                <th className="px-6 py-4">주소/비고</th>
                                <th className="px-6 py-4">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredStores.map(store => (
                                <tr key={store._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(store._id)}
                                            onChange={(e) => {
                                                if (e.target.checked) setSelectedIds([...selectedIds, store._id]);
                                                else setSelectedIds(selectedIds.filter(id => id !== store._id));
                                            }}
                                            className="w-4 h-4 accent-orange-500 rounded"
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">{store.registrationDate}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-black text-slate-900">{store.storeName}</div>
                                        <a
                                            href={`https://map.naver.com/v5/search/${encodeURIComponent(store.address)}`}
                                            target="_blank" rel="noreferrer"
                                            className="text-[10px] text-blue-500 font-bold hover:underline"
                                        >
                                            네이버 거리뷰 ↗
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-700">{store.ownerName}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs font-bold text-slate-900">{store.mobilePhone}</div>
                                        <div className="text-[10px] text-slate-400">{store.storePhone}</div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500">{store.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${store.status === '영업중' ? 'bg-green-100 text-green-700' :
                                                store.status === '폐업' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {store.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 max-w-[200px]">
                                        <div className="text-xs text-slate-600 truncate">{store.address} {store.detailAddress}</div>
                                        {store.remarks && <div className="text-[10px] text-orange-500 font-bold mt-1 truncate">{store.remarks}</div>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-slate-400 hover:text-slate-900">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredStores.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="px-6 py-20 text-center text-slate-400 font-medium">매장 이력이 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ADD MODAL */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-[2.5rem] p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in duration-200">
                        <h3 className="text-2xl font-black text-slate-900 mb-6">신규 매장 등록</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">등록일</label>
                                <input type="date" value={form.registrationDate} onChange={(e) => setForm({ ...form, registrationDate: e.target.value })} className="w-full p-3 bg-slate-50 rounded-xl border border-gray-100 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">운영 상태</label>
                                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })} className="w-full p-3 bg-slate-50 rounded-xl border border-gray-100 outline-none">
                                    <option value="영업중">영업중</option>
                                    <option value="폐업">폐업</option>
                                    <option value="계약종료">계약종료</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">매장명</label>
                                <input type="text" value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} className="w-full p-3 bg-slate-50 rounded-xl border border-gray-100 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">점주명</label>
                                <input type="text" value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} className="w-full p-3 bg-slate-50 rounded-xl border border-gray-100 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">점주 핸드폰</label>
                                <input type="tel" inputMode="numeric" value={form.mobilePhone} onChange={(e) => handlePhoneChange(e, 'mobilePhone')} placeholder="010-0000-0000" className="w-full p-3 bg-slate-50 rounded-xl border border-gray-100 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">매장 전화번호</label>
                                <input type="tel" inputMode="numeric" value={form.storePhone} onChange={(e) => handlePhoneChange(e, 'storePhone')} placeholder="02-000-0000" className="w-full p-3 bg-slate-50 rounded-xl border border-gray-100 outline-none" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 mb-1">이메일</label>
                                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full p-3 bg-slate-50 rounded-xl border border-gray-100 outline-none" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 mb-1">매장 주소</label>
                                <div className="flex gap-2 mb-2">
                                    <input type="text" value={form.address} readOnly onClick={handleSearchAddress} placeholder="주소 검색" className="flex-1 p-3 bg-slate-50 rounded-xl border border-gray-100 outline-none cursor-pointer" />
                                    <button onClick={handleSearchAddress} className="px-4 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-orange-500 transition">검색</button>
                                </div>
                                <input type="text" value={form.detailAddress} onChange={(e) => setForm({ ...form, detailAddress: e.target.value })} placeholder="상세주소 입력" className="w-full p-3 bg-slate-50 rounded-xl border border-gray-100 outline-none" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 mb-1">비고</label>
                                <textarea value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} className="w-full p-3 bg-slate-50 rounded-xl border border-gray-100 outline-none h-20 resize-none" />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button onClick={handleSave} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-orange-600 transition shadow-lg shadow-slate-900/10">매장 등록</button>
                            <button onClick={() => setIsAddModalOpen(false)} className="px-8 py-4 bg-gray-100 text-slate-500 rounded-2xl font-bold hover:bg-gray-200 transition">취소</button>
                        </div>
                    </div>
                </div>
            )}

            {/* BULK MODAL */}
            {isBulkModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full animate-in zoom-in duration-200">
                        <h3 className="text-2xl font-black text-slate-900 mb-6">매장 일괄 등록</h3>
                        <div className="space-y-6">
                            <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100">
                                <p className="text-sm text-orange-800 mb-4 font-medium">대량의 매장 정보를 엑셀 파일로 한 번에 등록하세요.</p>
                                <button
                                    onClick={downloadTemplate}
                                    className="w-full py-3 bg-white border border-orange-200 text-orange-600 rounded-xl font-bold text-xs hover:bg-orange-100 transition flex items-center justify-center gap-2 shadow-sm"
                                >
                                    📥 등록 양식 다운로드 (.xlsx)
                                </button>
                            </div>

                            <div className="border-2 border-dashed border-gray-200 rounded-[2rem] p-10 text-center hover:border-orange-500 transition cursor-pointer relative bg-slate-50/30 group">
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📄</div>
                                <p className="text-sm font-bold text-slate-700 mb-1">엑셀 파일을 선택하거나 업로드하세요</p>
                                <p className="text-xs text-slate-400">지원하는 형식: .xlsx, .xls</p>
                                <input
                                    type="file"
                                    accept=".xlsx, .xls"
                                    onChange={handleBulkUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>
                        <div className="mt-8">
                            <button onClick={() => setIsBulkModalOpen(false)} className="w-full py-4 text-slate-500 font-bold hover:text-slate-900 transition underline">닫기</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoreManagement;
