'use client'
import { useState } from 'react';
import { ICONS } from '@/assets/icons';
import { financialCategoryRepository } from '@/repositories/FinancialCategoryRepository';
import { financialTagRepository } from '@/repositories/FinancialTagRepository';
import { payeeRepository } from '@/repositories/PayeeRepository';
import { sourceRepository } from '@/repositories/SourceRepository';
import { FinancialCategoryModel } from '@/models/FinancialCategoryModel';
import { FinancialTagModel } from '@/models/FinancialTagModel';
import { PayeeModel } from '@/models/PayeeModel';
import { SourceModel } from '@/models/SourceModel';
import { FINANCIAL_CATEGORY_TYPES, FINANCIAL_CATEGORY_TYPES_LABELS, FINANCIAL_CATEGORY_TYPES_OPTIONS } from '@/enums/FinancialCategoryTypes';
import { AlertService } from '@/services/alertService';
import { ColorService } from '@/services/ColorService';
import { TextInput } from '@/components/inputs/TextInput';
import { ColorInput } from '@/components/inputs/ColorInput';
import { SelectInput } from '@/components/inputs/SelectInput';
import { IconBtn } from '@/components/buttons/IconBtn';

const SECTIONS = [
    { key: 'categories', label: 'Categorias' },
    { key: 'tags',       label: 'Tags' },
    { key: 'payees',     label: 'Beneficiários' },
    { key: 'sources',    label: 'Fontes' },
];

export function FinancialSettingsModal({ isOpen, onClose, categories, tags, payees, sources, user }) {

    if (!isOpen) return null;

    const [activeSection, setActiveSection] = useState(SECTIONS[0].key);

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-xl w-full max-w-2xl flex overflow-hidden' style={{ minHeight: '400px' }}>

                {/* Sidebar */}
                <aside className='w-44 bg-gray-50 border-r border-gray-200 flex flex-col py-4 gap-1'>
                    <span className='text-xs text-gray-400 uppercase font-semibold px-4 mb-2'>
                        Configurações
                    </span>
                    {SECTIONS.map(section => (
                        <button
                            key={section.key}
                            onClick={() => setActiveSection(section.key)}
                            className={`
                                text-left px-4 py-2 text-sm transition-colors duration-150 cursor-pointer
                                ${activeSection === section.key
                                    ? 'bg-primary/10 text-primary font-medium border-r-2 border-primary'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }
                            `}
                        >
                            {section.label}
                        </button>
                    ))}
                </aside>

                {/* Content */}
                <div className='flex-1 flex flex-col'>
                    <header className='flex items-center justify-between px-6 py-4 border-b border-gray-200'>
                        <h2 className='text-lg'>
                            {SECTIONS.find(s => s.key === activeSection)?.label}
                        </h2>
                        <span onClick={onClose} className='text-2xl cursor-pointer text-gray-500 hover:text-gray-800'>
                            <ICONS.close />
                        </span>
                    </header>
                    <div className='flex-1 px-6 py-4 overflow-y-auto'>
                        <SettingsSectionContent
                            section={activeSection}
                            categories={categories}
                            tags={tags}
                            payees={payees}
                            sources={sources}
                            user={user}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}

function SettingsSectionContent({ section, categories, tags, payees, sources, user }) {
    switch (section) {
        case 'categories': return <CategoriesSection categories={categories} user={user} />;
        case 'tags':       return <TagsSection tags={tags} categories={categories} user={user} />;
        case 'payees':     return <PayeesSection payees={payees} user={user} />;
        case 'sources':    return <SourcesSection sources={sources} user={user} />;
        default:           return null;
    }
}

function CategoriesSection({ categories, user }) {

    const [newTitle, setNewTitle] = useState('');
    const [newColor, setNewColor] = useState('6366f1');
    const [newType, setNewType] = useState(FINANCIAL_CATEGORY_TYPES.EXPENSE);

    const [editingId, setEditingId] = useState(null);
    const [editValues, setEditValues] = useState({});

    function startEdit(category) {
        setEditingId(category.id);
        setEditValues({ title: category.title, color: category.color, type: category.type });
    }

    function cancelEdit() {
        setEditingId(null);
        setEditValues({});
    }

    async function handleAdd() {
        if (!newTitle.trim()) return;
        try {
            const model = new FinancialCategoryModel({ title: newTitle.trim(), color: newColor, type: newType, userId: user.id });
            await financialCategoryRepository.insert(model);
            categories.refresh();
            setNewTitle('');
            AlertService.fastSuccess();
        } catch(e) {
            AlertService.error(e.message);
        }
    }

    async function handleSave(id) {
        if (!editValues.title?.trim()) return;
        try {
            await financialCategoryRepository.update(id, { title: editValues.title.trim(), color: editValues.color, type: editValues.type });
            categories.refresh();
            cancelEdit();
            AlertService.fastSuccess();
        } catch(e) {
            AlertService.error(e.message);
        }
    }

    async function handleDelete(id) {
        try {
            await financialCategoryRepository.delete(id);
            categories.refresh();
        } catch(e) {
            AlertService.error(e.message);
        }
    }

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
                <ColorInput value={ColorService.numberToHex(newColor)} setValue={v => setNewColor(v.replace('#', ''))} width='46px' />
                <div className='flex-1'>
                    <TextInput placeholder='Nova categoria' value={newTitle} setValue={setNewTitle} />
                </div>
                <div className='w-36'>
                    <SelectInput options={FINANCIAL_CATEGORY_TYPES_OPTIONS} value={newType} setValue={setNewType} />
                </div>
                <IconBtn icon={ICONS.add} onClick={handleAdd} />
            </div>

            <div className='flex flex-col gap-1'>
                {categories?.list?.length === 0 && (
                    <span className='text-sm text-gray-400'>Nenhuma categoria cadastrada.</span>
                )}
                {categories?.list?.map(category => (
                    <div key={category.id} className='flex items-center justify-between px-3 py-2 rounded-lg border border-gray-100 hover:bg-gray-50'>
                        {editingId === category.id ? (
                            <>
                                <div className='flex items-center gap-2 flex-1 mr-2'>
                                    <ColorInput value={ColorService.numberToHex(editValues.color)} setValue={v => setEditValues(p => ({ ...p, color: v.replace('#', '') }))} width='36px' />
                                    <div className='flex-1'>
                                        <TextInput value={editValues.title} setValue={v => setEditValues(p => ({ ...p, title: v }))} />
                                    </div>
                                    <div className='w-32'>
                                        <SelectInput options={FINANCIAL_CATEGORY_TYPES_OPTIONS} value={editValues.type} setValue={v => setEditValues(p => ({ ...p, type: v }))} />
                                    </div>
                                </div>
                                <div className='flex gap-1'>
                                    <IconBtn icon={ICONS.check} color='text-primary' size='text-base' onClick={() => handleSave(category.id)} />
                                    <IconBtn icon={ICONS.close} color='text-gray-400' size='text-base' onClick={cancelEdit} />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='flex items-center gap-3'>
                                    <span
                                        className='text-sm font-medium px-3 py-0.5 rounded-full'
                                        style={{
                                            backgroundColor: ColorService.numberToHex(category.color),
                                            color: ColorService.getContrastColor(category.color)
                                        }}
                                    >
                                        {category.title}
                                    </span>
                                    <span className='text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full'>
                                        {FINANCIAL_CATEGORY_TYPES_LABELS[category.type]}
                                    </span>
                                </div>
                                <div className='flex gap-1'>
                                    <IconBtn icon={ICONS.edit} color='text-gray-400' size='text-base' onClick={() => startEdit(category)} />
                                    <IconBtn icon={ICONS.close} color='text-gray-400' size='text-base' onClick={() => handleDelete(category.id)} />
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function TagsSection({ tags, categories, user }) {

    const [newTitle, setNewTitle] = useState('');
    const [newColor, setNewColor] = useState('6366f1');
    const [newCategoryId, setNewCategoryId] = useState('');

    const [editingId, setEditingId] = useState(null);
    const [editValues, setEditValues] = useState({});

    const categoryOptions = categories?.list?.map(c => ({ value: c.id, label: c.title })) ?? [];

    function startEdit(tag) {
        setEditingId(tag.id);
        setEditValues({ title: tag.title, color: tag.color, categoryId: tag.categoryId ?? '' });
    }

    function cancelEdit() {
        setEditingId(null);
        setEditValues({});
    }

    async function handleAdd() {
        if (!newTitle.trim()) return;
        try {
            const model = new FinancialTagModel({ title: newTitle.trim(), color: newColor, categoryId: newCategoryId || null, userId: user.id });
            await financialTagRepository.insert(model);
            tags.refresh();
            setNewTitle('');
            AlertService.fastSuccess();
        } catch(e) {
            AlertService.error(e.message);
        }
    }

    async function handleSave(id) {
        if (!editValues.title?.trim()) return;
        try {
            await financialTagRepository.update(id, { title: editValues.title.trim(), color: editValues.color, categoryId: editValues.categoryId || null });
            tags.refresh();
            cancelEdit();
            AlertService.fastSuccess();
        } catch(e) {
            AlertService.error(e.message);
        }
    }

    async function handleDelete(id) {
        try {
            await financialTagRepository.delete(id);
            tags.refresh();
        } catch(e) {
            AlertService.error(e.message);
        }
    }

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
                <ColorInput value={ColorService.numberToHex(newColor)} setValue={v => setNewColor(v.replace('#', ''))} width='46px' />
                <div className='flex-1'>
                    <TextInput placeholder='Nova tag' value={newTitle} setValue={setNewTitle} />
                </div>
                <div className='w-36'>
                    <SelectInput options={categoryOptions} value={newCategoryId} setValue={setNewCategoryId} placeholder='Categoria' />
                </div>
                <IconBtn icon={ICONS.add} onClick={handleAdd} />
            </div>

            <div className='flex flex-col gap-1'>
                {tags?.list?.length === 0 && (
                    <span className='text-sm text-gray-400'>Nenhuma tag cadastrada.</span>
                )}
                {tags?.list?.map(tag => {
                    const category = categories?.list?.find(c => c.id === tag.categoryId);
                    return (
                        <div key={tag.id} className='flex items-center justify-between px-3 py-2 rounded-lg border border-gray-100 hover:bg-gray-50'>
                            {editingId === tag.id ? (
                                <>
                                    <div className='flex items-center gap-2 flex-1 mr-2'>
                                        <ColorInput value={ColorService.numberToHex(editValues.color)} setValue={v => setEditValues(p => ({ ...p, color: v.replace('#', '') }))} width='36px' />
                                        <div className='flex-1'>
                                            <TextInput value={editValues.title} setValue={v => setEditValues(p => ({ ...p, title: v }))} />
                                        </div>
                                        <div className='w-32'>
                                            <SelectInput options={categoryOptions} value={editValues.categoryId} setValue={v => setEditValues(p => ({ ...p, categoryId: v }))} placeholder='Categoria' />
                                        </div>
                                    </div>
                                    <div className='flex gap-1'>
                                        <IconBtn icon={ICONS.check} color='text-primary' size='text-base' onClick={() => handleSave(tag.id)} />
                                        <IconBtn icon={ICONS.close} color='text-gray-400' size='text-base' onClick={cancelEdit} />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className='flex items-center gap-3'>
                                        <span
                                            className='text-sm font-medium px-3 py-0.5 rounded-full'
                                            style={{
                                                backgroundColor: ColorService.numberToHex(tag.color),
                                                color: ColorService.getContrastColor(tag.color)
                                            }}
                                        >
                                            {tag.title}
                                        </span>
                                        {category && (
                                            <span className='text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full'>
                                                {category.title}
                                            </span>
                                        )}
                                    </div>
                                    <div className='flex gap-1'>
                                        <IconBtn icon={ICONS.edit} color='text-gray-400' size='text-base' onClick={() => startEdit(tag)} />
                                        <IconBtn icon={ICONS.close} color='text-gray-400' size='text-base' onClick={() => handleDelete(tag.id)} />
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function PayeesSection({ payees, user }) {

    const [newName, setNewName] = useState('');

    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');

    function startEdit(payee) {
        setEditingId(payee.id);
        setEditName(payee.name);
    }

    function cancelEdit() {
        setEditingId(null);
        setEditName('');
    }

    async function handleAdd() {
        if (!newName.trim()) return;
        try {
            const model = new PayeeModel({ name: newName.trim(), userId: user.id });
            await payeeRepository.insert(model);
            payees.refresh();
            setNewName('');
            AlertService.fastSuccess();
        } catch(e) {
            AlertService.error(e.message);
        }
    }

    async function handleSave(id) {
        if (!editName.trim()) return;
        try {
            await payeeRepository.update(id, { name: editName.trim() });
            payees.refresh();
            cancelEdit();
            AlertService.fastSuccess();
        } catch(e) {
            AlertService.error(e.message);
        }
    }

    async function handleDelete(id) {
        try {
            await payeeRepository.delete(id);
            payees.refresh();
        } catch(e) {
            AlertService.error(e.message);
        }
    }

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
                <div className='flex-1'>
                    <TextInput placeholder='Novo beneficiário' value={newName} setValue={setNewName} />
                </div>
                <IconBtn icon={ICONS.add} onClick={handleAdd} />
            </div>

            <div className='flex flex-col gap-1'>
                {payees?.list?.length === 0 && (
                    <span className='text-sm text-gray-400'>Nenhum beneficiário cadastrado.</span>
                )}
                {payees?.list?.map(payee => (
                    <div key={payee.id} className='flex items-center justify-between px-3 py-2 rounded-lg border border-gray-100 hover:bg-gray-50'>
                        {editingId === payee.id ? (
                            <>
                                <div className='flex-1 mr-2'>
                                    <TextInput value={editName} setValue={setEditName} />
                                </div>
                                <div className='flex gap-1'>
                                    <IconBtn icon={ICONS.check} color='text-primary' size='text-base' onClick={() => handleSave(payee.id)} />
                                    <IconBtn icon={ICONS.close} color='text-gray-400' size='text-base' onClick={cancelEdit} />
                                </div>
                            </>
                        ) : (
                            <>
                                <span className='text-sm'>{payee.name}</span>
                                <div className='flex gap-1'>
                                    <IconBtn icon={ICONS.edit} color='text-gray-400' size='text-base' onClick={() => startEdit(payee)} />
                                    <IconBtn icon={ICONS.close} color='text-gray-400' size='text-base' onClick={() => handleDelete(payee.id)} />
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function SourcesSection({ sources, user }) {

    const [newName, setNewName] = useState('');

    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');

    function startEdit(source) {
        setEditingId(source.id);
        setEditName(source.name);
    }

    function cancelEdit() {
        setEditingId(null);
        setEditName('');
    }

    async function handleAdd() {
        if (!newName.trim()) return;
        try {
            const model = new SourceModel({ name: newName.trim(), userId: user.id });
            await sourceRepository.insert(model);
            sources.refresh();
            setNewName('');
            AlertService.fastSuccess();
        } catch(e) {
            AlertService.error(e.message);
        }
    }

    async function handleSave(id) {
        if (!editName.trim()) return;
        try {
            await sourceRepository.update(id, { name: editName.trim() });
            sources.refresh();
            cancelEdit();
            AlertService.fastSuccess();
        } catch(e) {
            AlertService.error(e.message);
        }
    }

    async function handleDelete(id) {
        try {
            await sourceRepository.delete(id);
            sources.refresh();
        } catch(e) {
            AlertService.error(e.message);
        }
    }

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
                <div className='flex-1'>
                    <TextInput placeholder='Nova fonte' value={newName} setValue={setNewName} />
                </div>
                <IconBtn icon={ICONS.add} onClick={handleAdd} />
            </div>

            <div className='flex flex-col gap-1'>
                {sources?.list?.length === 0 && (
                    <span className='text-sm text-gray-400'>Nenhuma fonte cadastrada.</span>
                )}
                {sources?.list?.map(source => (
                    <div key={source.id} className='flex items-center justify-between px-3 py-2 rounded-lg border border-gray-100 hover:bg-gray-50'>
                        {editingId === source.id ? (
                            <>
                                <div className='flex-1 mr-2'>
                                    <TextInput value={editName} setValue={setEditName} />
                                </div>
                                <div className='flex gap-1'>
                                    <IconBtn icon={ICONS.check} color='text-primary' size='text-base' onClick={() => handleSave(source.id)} />
                                    <IconBtn icon={ICONS.close} color='text-gray-400' size='text-base' onClick={cancelEdit} />
                                </div>
                            </>
                        ) : (
                            <>
                                <span className='text-sm'>{source.name}</span>
                                <div className='flex gap-1'>
                                    <IconBtn icon={ICONS.edit} color='text-gray-400' size='text-base' onClick={() => startEdit(source)} />
                                    <IconBtn icon={ICONS.close} color='text-gray-400' size='text-base' onClick={() => handleDelete(source.id)} />
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
