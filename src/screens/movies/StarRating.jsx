'use client'
import { useState } from 'react';
import { FaStar } from 'react-icons/fa6';

export function StarRating({ value, onChange, size = 'md', readonly = false }) {
    const [hovered, setHovered] = useState(null);

    const sizeCls = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg';

    return (
        <div className='flex gap-0.5'>
            {[1, 2, 3, 4, 5].map(star => {
                const filled = hovered != null ? star <= hovered : star <= (value ?? 0);
                return (
                    <button
                        key={star}
                        type='button'
                        disabled={readonly}
                        onClick={() => onChange?.(star)}
                        onMouseEnter={() => !readonly && setHovered(star)}
                        onMouseLeave={() => !readonly && setHovered(null)}
                        className={`
                            ${sizeCls} transition-colors duration-100
                            ${readonly ? 'cursor-default' : 'cursor-pointer'}
                            ${filled ? 'text-amber-400' : 'text-gray-300'}
                        `}
                    >
                        <FaStar />
                    </button>
                );
            })}
        </div>
    );
}
