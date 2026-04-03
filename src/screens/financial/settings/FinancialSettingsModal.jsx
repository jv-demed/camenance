'use client'
import { useState } from 'react';
import { ICONS } from '@/assets/icons';
import { CategoriesSection } from '@/screens/financial/settings/CategoriesSection';
import { TagsSection } from '@/screens/financial/settings/TagsSection';
import { PayeesSection } from '@/screens/financial/settings/PayeesSection';
import { SourcesSection } from '@/screens/financial/settings/SourcesSection';
import { CreditCardsSection } from '@/screens/financial/settings/CreditCardsSection';

const SECTIONS = [
    { key: 'categories', label: 'Categorias' },
    { key: 'tags',       label: 'Tags' },
    { key: 'payees',     label: 'Beneficiários' },
    { key: 'sources',    label: 'Fontes' },
    { key: 'creditCards', label: 'Cartões' },
];

export function FinancialSettingsModal({ isOpen, onClose, categories, tags, payees, sources, creditCards, user }) {

    if (!isOpen) return null;

    const [activeSection, setActiveSection] = useState(SECTIONS[0].key);

    function renderSection() {
        switch (activeSection) {
            case 'categories': return <CategoriesSection categories={categories} user={user} />;
            case 'tags':       return <TagsSection tags={tags} categories={categories} user={user} />;
            case 'payees':     return <PayeesSection payees={payees} user={user} />;
            case 'sources':    return <SourcesSection sources={sources} user={user} />;
            case 'creditCards': return <CreditCardsSection creditCards={creditCards} user={user} />;
            default:           return null;
        }
    }

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-xl w-full max-w-2xl flex overflow-hidden max-h-[90vh]'>

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
                        {renderSection()}
                    </div>
                </div>

            </div>
        </div>
    );
}
