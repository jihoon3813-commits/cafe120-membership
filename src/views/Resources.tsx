import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { Resource, User } from '../types';

interface ResourcesProps {
    user: User | null;
}

const Resources: React.FC<ResourcesProps> = ({ user }) => {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editingResource, setEditingResource] = useState<Resource | null>(null);

    const [form, setForm] = useState({
        title: '',
        description: '',
        type: 'file' as 'image' | 'video' | 'file',
        fileUrl: '',
        fileStorageId: '',
        thumbnailUrl: '',
        thumbnailStorageId: '',
    });

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const data = await dbService.getResources();
            setResources(data as Resource[]);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'file' | 'thumbnail') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const postUrl = await dbService.generateUploadUrl();
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });
            const { storageId } = await result.json();

            // Store preview or placeholder
            const previewUrl = URL.createObjectURL(file);
            if (field === 'file') {
                setForm(prev => ({ ...prev, fileUrl: previewUrl, fileStorageId: storageId }));
            } else {
                setForm(prev => ({ ...prev, thumbnailUrl: previewUrl, thumbnailStorageId: storageId }));
            }
        } catch (e) {
            console.error(e);
            alert('업로드 실패');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        if (!form.title || !form.fileUrl) return alert('필수 정보를 입력하세요.');

        try {
            if (editingResource) {
                await dbService.updateResource(editingResource._id, form);
            } else {
                await dbService.addResource(form);
            }
            setIsModalOpen(false);
            setEditingResource(null);
            setForm({ title: '', description: '', type: 'file', fileUrl: '', fileStorageId: '', thumbnailUrl: '', thumbnailStorageId: '' });
            fetchResources();
        } catch (e) {
            console.error(e);
            alert('저장 중 오류 발생');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('정말 삭제하시겠습니까?')) {
            await dbService.deleteResource(id);
            fetchResources();
        }
    };

    const openEditModal = (res: Resource) => {
        setEditingResource(res);
        setForm({
            title: res.title,
            description: res.description || '',
            type: res.type,
            fileUrl: res.fileUrl,
            fileStorageId: res.fileStorageId || '',
            thumbnailUrl: res.thumbnailUrl || '',
            thumbnailStorageId: res.thumbnailStorageId || '',
        });
        setIsModalOpen(true);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'image': return '🖼️';
            case 'video': return '🎥';
            default: return '📄';
        }
    };

    const isAdmin = user?.role === 'admin';

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-900">자료실 📂</h2>
                    <p className="text-slate-500 mt-2">매장 운영에 필요한 각종 이미지, 영상, 문서를 다운로드하세요.</p>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => {
                            setEditingResource(null);
                            setForm({ title: '', description: '', type: 'file', fileUrl: '', fileStorageId: '', thumbnailUrl: '', thumbnailStorageId: '' });
                            setIsModalOpen(true);
                        }}
                        className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-500 transition-colors shadow-lg"
                    >
                        + 자료 등록
                    </button>
                )}
            </header>

            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {resources.map(res => (
                        <div key={res._id} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-xl transition-all group flex flex-col">
                            <div className="aspect-video bg-slate-50 relative overflow-hidden flex items-center justify-center text-5xl">
                                {res.thumbnailUrl ? (
                                    <img src={res.thumbnailUrl} alt={res.title} className="w-full h-full object-cover" />
                                ) : (
                                    <span>{getTypeIcon(res.type)}</span>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <a
                                        href={res.fileUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-white p-3 rounded-full text-sm font-bold shadow-lg hover:scale-110 transition-transform"
                                    >
                                        미리보기
                                    </a>
                                    <a
                                        href={res.fileUrl}
                                        download={res.title}
                                        className="bg-orange-500 text-white p-3 rounded-full text-sm font-bold shadow-lg hover:scale-110 transition-transform"
                                    >
                                        다운로드
                                    </a>
                                </div>
                                {isAdmin && (
                                    <div className="absolute top-3 right-3 flex gap-2">
                                        <button onClick={() => openEditModal(res)} className="bg-white/90 p-2 rounded-lg shadow text-xs">✏️</button>
                                        <button onClick={() => handleDelete(res._id)} className="bg-white/90 p-2 rounded-lg shadow text-xs">🗑️</button>
                                    </div>
                                )}
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <span className="text-[10px] font-black uppercase text-orange-500 mb-2">{res.type}</span>
                                <h3 className="text-lg font-black text-slate-900 mb-2 truncate">{res.title}</h3>
                                <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">{res.description}</p>
                                <div className="text-[10px] text-slate-400 font-bold uppercase">
                                    {new Date(res.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}
                    {resources.length === 0 && (
                        <div className="col-span-full py-20 text-center text-slate-400 bg-white rounded-[2rem] border border-dashed border-gray-200">
                            등록된 자료가 없습니다.
                        </div>
                    )}
                </div>
            )}

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in zoom-in duration-200">
                        <h3 className="text-2xl font-black text-slate-900 mb-6">{editingResource ? '자료 수정' : '자료 등록'}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">유형</label>
                                <select
                                    value={form.type}
                                    onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                                    className="w-full p-3 bg-slate-50 rounded-xl border border-gray-200 outline-none"
                                >
                                    <option value="file">일반 파일</option>
                                    <option value="image">이미지</option>
                                    <option value="video">영상</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">제목</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full p-3 bg-slate-50 rounded-xl border border-gray-200 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">설명</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full p-3 bg-slate-50 rounded-xl border border-gray-200 outline-none h-24 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">파일 업로드</label>
                                <div className="space-y-2">
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileUpload(e, 'file')}
                                        className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                                    />
                                    <input
                                        type="text"
                                        value={form.fileUrl}
                                        onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                                        placeholder="또는 파일 URL 입력"
                                        className="w-full p-2 bg-slate-50 rounded-lg border border-gray-200 outline-none text-[10px]"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">썸네일 (옵션)</label>
                                <div className="flex gap-4">
                                    <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0 flex items-center justify-center text-2xl">
                                        {form.thumbnailUrl ? <img src={form.thumbnailUrl} className="w-full h-full object-cover" /> : getTypeIcon(form.type)}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <input
                                            type="file"
                                            onChange={(e) => handleFileUpload(e, 'thumbnail')}
                                            className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                                        />
                                        <input
                                            type="text"
                                            value={form.thumbnailUrl}
                                            onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
                                            placeholder="또는 썸네일 URL 입력"
                                            className="w-full p-2 bg-slate-50 rounded-lg border border-gray-200 outline-none text-[10px]"
                                        />
                                    </div>
                                </div>
                            </div>
                            {uploading && <p className="text-orange-500 text-center font-bold text-xs">업로드 중...</p>}
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button onClick={handleSave} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-black hover:bg-orange-500 transition">저장</button>
                            <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-gray-100 text-slate-500 rounded-xl font-bold hover:bg-gray-200 transition">취소</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Resources;
