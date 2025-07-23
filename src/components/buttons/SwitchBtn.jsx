'use client';
import { useEffect, useState } from 'react';

export function SwitchBtn({ 
    isOn = false, 
    onToggle,
    alwaysActivedColor = false,
    labelLeft = () => null,
    labelRight = () => null
}){

    const [enabled, setEnabled] = useState(isOn);

    useEffect(() => {
        setEnabled(isOn);
    }, [isOn]);

    function handleChange(next){
        setEnabled(next);
        if(onToggle) onToggle(next);
    }

    function toggleSwitch(){
        handleChange(!enabled);
    }

    return (
        <div className='flex items-center gap-1'>
            <label className='flex cursor-pointer'    
                onClick={() => handleChange(false)}
            >
                {labelLeft()}    
            </label>
            <button
                onClick={toggleSwitch}
                className={`
                    inline-flex items-center 
                    relative h-6 w-11 rounded-full cursor-pointer
                    transition-colors duration-300 
                    ${alwaysActivedColor && 'bg-primary'}
                    ${(enabled && !alwaysActivedColor) ? 'bg-primary' : 'bg-gray-300'}
                `}
            >
                <span className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 
                    ${enabled ? 'translate-x-6' : 'translate-x-1'}
                `} />
            </button>
            <label className='flex cursor-pointer'
                onClick={() => handleChange(true)}
            >
                {labelRight()}
            </label>
        </div>
    );
}