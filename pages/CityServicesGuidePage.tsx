import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeftIcon, PlusIcon, PencilSquareIcon, TrashIcon,
    ChevronDownIcon, DocumentDuplicateIcon
} from '../components/common/Icons';
import type { ServiceGuide } from '../types';
import Modal from '../components/common/Modal';
import Spinner from '@/components/Spinner';

// react-query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';


// direct firestore functions for update/delete
import { db } from "@/config/firebase";
import { FIREBASE_DOCS } from "@/constants/firebase.constants";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { addCityServiceGuide, getAllCityAgency } from '@/services/firebase/cityServiceGuide';
import { CityAgencyDoc } from '@/types/firebaseDocs';


/* ---------- Helper mappers ---------- */
function toCityAgencyDocFromGuide(g: Omit<ServiceGuide, 'id'> & { id?: number | string } | ServiceGuide | null): CityAgencyDoc | null {
    if (!g) return null;
    // ensure id exists (use timestamp if not)
    const id = g.id ?? `${Date.now()}`;
    const title = (g as any).title ?? '';
    const steps = (g as any).steps ?? [];
    const documents = (g as any).documents ?? [];
    return {
        id: String(id),
        title,
        stepsToApply: steps,
        requiredDocs: documents
    };
}

function toServiceGuideFromCityDoc(doc: CityAgencyDoc): ServiceGuide {
    // ServiceGuide fields assumed: id (number|string), title, steps: string[], documents: string[]
    return {
        id: doc.id,
        title: doc.title,
        steps: doc.stepsToApply ?? [],
        documents: doc.requiredDocs ?? []
    } as unknown as ServiceGuide;
}

const GuideForm: React.FC<{
    onSave: (guide: Omit<ServiceGuide, 'id'> & { id?: string }) => void;
    onClose: () => void;
    guide: (Omit<ServiceGuide, 'id'> & { id?: string }) | null;
}> = ({ onSave, onClose, guide }) => {
    const [title, setTitle] = useState('');
    const [steps, setSteps] = useState('');
    const [documents, setDocuments] = useState('');

    useEffect(() => {
        if (guide) {
            setTitle(guide.title || '');
            setSteps((guide.steps || []).join('\n'));
            setDocuments((guide.documents || []).join('\n'));
        } else {
            setTitle('');
            setSteps('');
            setDocuments('');
        }
    }, [guide]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const stepsArray = steps.split('\n').map(s => s.trim()).filter(Boolean);
        const documentsArray = documents.split('\n').map(s => s.trim()).filter(Boolean);
        onSave({ id: guide?.id, title, steps: stepsArray, documents: documentsArray });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">عنوان الخدمة</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-md p-2 border border-transparent focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="steps" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">خطوات التقديم (كل خطوة في سطر)</label>
                <textarea
                    id="steps"
                    value={steps}
                    onChange={(e) => setSteps(e.target.value)}
                    required
                    rows={5}
                    className="w-full bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-md p-2 border border-transparent focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
            </div>

            <div className="mb-6">
                <label htmlFor="documents" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الأوراق المطلوبة (كل مستند في سطر)</label>
                <textarea
                    id="documents"
                    value={documents}
                    onChange={(e) => setDocuments(e.target.value)}
                    required
                    rows={5}
                    className="w-full bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-md p-2 border border-transparent focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
            </div>

            <div className="flex justify-end gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-500">إلغاء</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-600">حفظ</button>
            </div>
        </form>
    );
};

/* ---------- Component ---------- */
const CityServicesGuidePage: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // ui state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGuide, setEditingGuide] = useState<ServiceGuide | null>(null);
    const [openGuideId, setOpenGuideId] = useState<number | string | null>(null);

    useEffect(() => {
        // reset open guide when guides change externally
    }, []);

    // -------------- Fetch guides using useQuery --------------
    const {
        data: cityDocs,
        isLoading: isFetchingGuides,
        isError: isFetchError,
        error: fetchError
    } = useQuery<CityAgencyDoc[], Error>({
        queryKey: ['cityAgencyGuides'],
        queryFn: async () => await getAllCityAgency()
    });

    // map to ServiceGuide for UI
    const serviceGuides: ServiceGuide[] = (cityDocs ?? []).map(toServiceGuideFromCityDoc);

    // -------------- Mutations --------------
    // Add guide
    const addMutation = useMutation({
        mutationFn: async (payload: CityAgencyDoc) => {
            // uses your provided helper which adds the doc
            await addCityServiceGuide(payload);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['cityAgencyGuides']});
            setIsModalOpen(false);
            setEditingGuide(null);
        }
    });

    // Update guide
    const updateMutation = useMutation({
        mutationFn: async (payload: CityAgencyDoc) => {
            const ref = doc(db, FIREBASE_DOCS.CITY_AGENCY, payload.id);
            // map fields to stored shape
            await updateDoc(ref, {
                title: payload.title,
                stepsToApply: payload.stepsToApply ?? [],
                requiredDocs: payload.requiredDocs ?? []
            });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['cityAgencyGuides']});
            setIsModalOpen(false);
            setEditingGuide(null);
        }
    });

    // Delete guide
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const ref = doc(db, FIREBASE_DOCS.CITY_AGENCY, id);
            await deleteDoc(ref);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['cityAgencyGuides']});
        }
    });

    // -------------- Handlers --------------
    const handleToggleGuide = (id: number | string) => {
        setOpenGuideId(openGuideId === id ? null : id);
    };

    const handleAddClick = () => {
        setEditingGuide(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (guide: ServiceGuide) => {
        setEditingGuide(guide);
        setIsModalOpen(true);
    };

    const handleSaveServiceGuide = async (guide: Omit<ServiceGuide, 'id'> & { id?: number | string }) => {
        const cityDoc = toCityAgencyDocFromGuide(guide);
        if (!cityDoc) return;

        // If provided guide has an id that matches an existing doc -> update, else add
        const exists = (cityDocs ?? []).some(d => d.id === String(cityDoc.id));
        if (exists) {
            // update
            updateMutation.mutate(cityDoc);
        } else {
            // ensure id is set (we generate client id so Firestore doc contains id field)
            if (!cityDoc.id) cityDoc.id = String(Date.now());
            addMutation.mutate(cityDoc);
        }
    };

    const handleDeleteServiceGuide = (id: string | number) => {
        if (!confirm('هل أنت متأكد من حذف هذا الدليل؟')) return;
        deleteMutation.mutate(String(id));
    };

    // -------------- Derived UI states --------------
    const isAnyMutationLoading = addMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

    // -------------- Render --------------
    if (isFetchingGuides) {
        return <Spinner />;
    }

    if (isFetchError) {
        return (
            <div className="p-6">
                <div className="text-red-500">حدث خطأ أثناء جلب بيانات الأدلة: {String(fetchError?.message ?? fetchError)}</div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>العودة إلى لوحة التحكم</span>
            </button>

            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                        <DocumentDuplicateIcon className="w-8 h-8 text-cyan-500" />
                        دليل خدمات المدينة
                    </h1>
                    <button
                        onClick={handleAddClick}
                        disabled={isAnyMutationLoading}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-60"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>إضافة دليل جديد</span>
                    </button>
                </div>

                <div className="space-y-4">
                    {serviceGuides.length === 0 && (
                        <div className="text-gray-500 dark:text-gray-400 p-6">لا توجد أدلة حالياً.</div>
                    )}

                    {serviceGuides.map(guide => (
                        <div key={guide.id} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                            <button onClick={() => handleToggleGuide(guide.id)} className="w-full flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-right">
                                <span className="font-semibold text-lg text-gray-800 dark:text-white">{guide.title}</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleEditClick(guide); }}
                                        disabled={isAnyMutationLoading}
                                        className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md"
                                        title="تعديل الدليل"
                                    >
                                        <PencilSquareIcon className="w-5 h-5" />
                                    </button>

                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteServiceGuide(guide.id); }}
                                        disabled={isAnyMutationLoading}
                                        className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md"
                                        title="حذف الدليل"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>

                                    <ChevronDownIcon className={`w-6 h-6 transition-transform duration-300 ${openGuideId === guide.id ? 'rotate-180' : ''}`} />
                                </div>
                            </button>

                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openGuideId === guide.id ? 'max-h-[1000px]' : 'max-h-0'}`}>
                                <div className="p-6 bg-white dark:bg-slate-800 grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-md font-bold mb-3 text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-500/30 pb-2">خطوات التقديم</h3>
                                        <ul className="space-y-2 list-decimal list-inside text-gray-600 dark:text-gray-300">
                                            {guide.steps.map((step, i) => <li key={i}>{step}</li>)}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-md font-bold mb-3 text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-500/30 pb-2">الأوراق المطلوبة</h3>
                                        <ul className="space-y-2 list-decimal list-inside text-gray-600 dark:text-gray-300">
                                            {guide.documents.map((doc, i) => <li key={i}>{doc}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    if (!isAnyMutationLoading) {
                        setIsModalOpen(false);
                        setEditingGuide(null);
                    }
                }}
                title={editingGuide ? 'تعديل الدليل' : 'إضافة دليل جديد'}
            >
                {/* Inline GuideForm component (if you keep the earlier inline form, adapt props). */}
                <GuideForm
                    onSave={(g) => handleSaveServiceGuide(g)}
                    onClose={() => { if (!isAnyMutationLoading) setIsModalOpen(false); }}
                    guide={editingGuide ? editingGuide : null}
                />
            </Modal>
        </div>
    );
};

export default CityServicesGuidePage;
