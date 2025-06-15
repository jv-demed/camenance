'use client'
import { ICONS } from '@/assets/icons';

export function Modal({ 
    onClose,
    title,
    children
}) {
    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-xl px-6 py-2 w-full max-w-md'>
                <header className='flex items-center justify-between mb-4'>
                    <h2 className='text-xl'>
                        {title}
                    </h2>
                    <span onClick={onClose}
                        className='text-2xl cursor-pointer'
                    >
                        <ICONS.close />
                    </span>
                </header>
                <div className='flex flex-col gap-2 mb-2'>
                    {children}
                </div>
            </div>
        </div>
    );
}