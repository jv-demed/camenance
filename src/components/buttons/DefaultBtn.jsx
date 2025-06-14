import { useState } from 'react';
import { SpinLoader } from '@/components/elements/SpinLoader';

export function DefaultBtn({ 
    text,
    type = 'button',
    width = '100%',
    style = '',
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
            style={{
                width: width
            }}
            className={`
                flex items-center justify-center
                bg-primary text-white cursor-pointer 
                rounded-xl p-3
                transition-all duration-300 
                hover:shadow-lg hover:-translate-y-1
                ${style} 
            `}
        >
            {isLoading 
                ? <SpinLoader color='white' /> 
                : <>
                    {text && <span>{text}</span>}
                    {Icon && <span className='text-xl'>
                        <Icon/>    
                    </span>}
                </>
            }
        </button>
    );
}