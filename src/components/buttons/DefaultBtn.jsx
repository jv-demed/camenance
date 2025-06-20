import { useState } from 'react';
import { SpinLoader } from '@/components/elements/SpinLoader';

export function DefaultBtn({ 
    text,
    type = 'button',
    width = '100%',
    bg = 'bg-primary',
    disabled = false,
    style = {},
    icon: Icon,
    onClick = async () => {}
}){

    const [isLoading, setIsLoading] = useState(false);

    return (
        <button 
            type={type}
            onClick={async () => {
                setIsLoading(true);
                try {
                    await onClick();
                } finally {
                    setIsLoading(false);
                }
            }}
            disabled={disabled}
            style={{
                ...style,
                backgroundColor: disabled && 'gray',
                cursor: disabled && 'not-allowed',
                width: width
            }}
            className={`
                flex items-center justify-center
                text-white cursor-pointer 
                rounded-xl p-3 ${bg}
                ${!disabled && `
                    transition-all duration-300 
                    hover:shadow-lg hover:-translate-y-1    
                `}
            `}
        >
            {isLoading 
                ? <SpinLoader color='white' /> 
                : <div className='flex items-center gap-2'>
                    {text && <span>{text}</span>}
                    {Icon && <span className='text-xl'>
                        <Icon/>    
                    </span>}
                </div>
            }
        </button>
    );
}