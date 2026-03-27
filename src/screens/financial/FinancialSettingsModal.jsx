'use client'
import { useState } from 'react';
import { ICONS } from '@/assets/icons';

const SECTIONS = [
    { key: 'categories', label: 'Categorias' },
    { key: 'tags',       label: 'Tags' },
    { key: 'payees',     label: 'Beneficiários' },
    { key: 'sources',    label: 'Fontes' },
];

export function FinancialSettingsModal({ isOpen, onClose }) {

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
                        <SettingsSectionContent section={activeSection} />
                    </div>
                </div>

            </div>
        </div>
    );
}

function SettingsSectionContent({ section }) {
    switch (section) {
        case 'categories': return <CategoriesSection />;
        case 'tags':       return <TagsSection />;
        case 'payees':     return <PayeesSection />;
        case 'sources':    return <SourcesSection />;
        default:           return null;
    }
}

function CategoriesSection() {
    return <div className='text-sm text-gray-500'>Gerencie suas categorias financeiras.</div>;
}

function TagsSection() {
    return <div className='text-sm text-gray-500'>Gerencie suas tags.</div>;
}

function PayeesSection() {
    return <div className='text-sm text-gray-500'>Gerencie seus beneficiários.</div>;
}

function SourcesSection() {
    return <div className='text-sm text-gray-500'>Gerencie suas fontes de renda.</div>;
}
