import { useState } from 'react';
import { SpinLoader } from '@/components/elements/SpinLoader';

export function IconBtn({
    icon: Icon,
    type = 'button',
    size = 'text-xl',
    color = 'text-primary',
    disabled = false,
    style = {},
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
                cursor: disabled && 'not-allowed',
            }}
            className={`
                flex items-center justify-center
                ${color} ${size} cursor-pointer rounded-lg p-1
                ${!disabled && `
                    transition-all duration-300
                    hover:opacity-70 hover:-translate-y-0.5
                `}
            `}
        >
            {isLoading
                ? <SpinLoader color='white' />
                : Icon && <Icon />
            }
        </button>
    );
}
