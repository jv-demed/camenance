'use client'
import { useState } from 'react';
import { ICONS } from '@/assets/icons';
import { MENU_ITEMS } from './manuItem';
import { useRouter } from 'next/navigation';

export function Sidebar() {

    const router = useRouter();
    
    const [isOpened, setIsOpened] = useState(false);
    
    return (
        <aside className={`
            sticky top-0
            h-screen flex-shrink-0
            flex flex-col justify-between
            bg-primary text-white
            px-2 py-5
            ${isOpened ? 'w-64' : 'w-16'}
            transition-all duration-300 ease-in-out
        `}>
            <nav className='flex flex-col gap-4 pt-10'>
                <ul className={`
                    flex flex-col justify-center gap-4
                    ${isOpened ? 'pl-8' : 'items-center'}    
                `}>
                    {MENU_ITEMS.map((item, i) => (
                        <li key={`item-${i}`}
                            className='flex gap-2 cursor-pointer'
                            onClick={() => router.push(item.url)}
                        >
                            <item.icon className='text-2xl' />
                            {isOpened && 
                                <span className={`
                                    ml-2 overflow-hidden whitespace-nowrap
                                    transition-all duration-300 ease-in-out
                                    ${isOpened
                                        ? 'max-w-[200px] opacity-100'
                                        : 'max-w-0 opacity-0'}
                                    `}>
                                    {item.name}        
                                </span>
                            }
                        </li>
                    ))}
                </ul>
                <div className='w-full h-[1px] bg-border' />
            </nav>
            <button onClick={() => setIsOpened(!isOpened)}
                className={` 
                    flex justify-center
                    text-3xl cursor-pointer   
                `}    
            >
                {isOpened ?
                    <ICONS.arrowLeft /> :
                    <ICONS.arrowRight />
                }
            </button>
        </aside>
    )
}