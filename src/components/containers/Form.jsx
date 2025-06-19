'use client'
import { useState } from 'react';
import { SpinLoader } from '@/components/elements/SpinLoader';

export function Form({ 
    children,
    width = '100%',
    style = {},
    onSubmit = async () => {}
}){

    const [isLoading, setIsLoading] = useState(false);

    return (
        <form 
            onSubmit={async e => {
                e.preventDefault();
                setIsLoading(true);
                try {
                    await onSubmit();
                } finally {
                    setIsLoading(false);
                }
            }}
            style={{ ...style, width }}
            className='flex flex-col items-center justify-start gap-4'
        >
            {children}
            {isLoading && <div
                className={`
                    flex items-center
                    fixed inset-0
                    backdrop-blur-sm z-100
                `}
            >
                <SpinLoader />
            </div>}
        </form>
    );
}