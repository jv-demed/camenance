import { useState, useEffect, useRef } from 'react';
import { AlertService } from '@/services/alertService';
import { ICONS } from '@/assets/icons';
import { SpinLoader } from '@/components/elements/SpinLoader';

export function AddInput({
    suggestions = [],
    refresh,
    labelField = 'name',
    value = null,
    setValue = () => {},
    onCreate = async () => {},
    onSelect = async () => {},
    placeholder = 'Digite algo...',
    width = '100%'
}) {

    const containerRef = useRef(null);
    const listRef = useRef(null);

    const [inputValue, setInputValue] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isNewEntry, setIsNewEntry] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(-1);
    const [lastValue, setLastValue] = useState(value);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(value !== lastValue) {
            setLastValue(value);  
            if(value == null) return;
            const found = suggestions.find(s => s.id === value);
            if(found) {
                setInputValue(String(found[labelField]));
            }
        }
    }, [value, suggestions]);

    useEffect(() => {
        if(inputValue.trim() === '') {
            setFilteredSuggestions([]);
            setShowDropdown(false);
            setHighlightIndex(-1);
            return;
        }
        const filtered = suggestions.filter(s =>
            s[labelField].toLowerCase().includes(inputValue.toLowerCase())
        );
        setFilteredSuggestions(filtered);
        setHighlightIndex(-1);
    }, [inputValue, suggestions]);

    useEffect(() => {
        const exactMatch = suggestions.find(s => 
            s[labelField].toLowerCase() === inputValue.toLowerCase()
        );
        if(exactMatch) {
            setValue(exactMatch.id);
            setIsNewEntry(false);
        } else {
            setValue();
            setIsNewEntry(true);
        }
    }, [inputValue, suggestions]);

    useEffect(() => {
        const check = inputValue.trim() !== '' &&
            !suggestions.some(s => s[labelField].toLowerCase() === inputValue.toLowerCase());
        setShowDropdown(check); 
        setIsNewEntry(check);
    }, [inputValue, suggestions]);

    useEffect(() => {
        const handleClickOutside = e => {
            if(containerRef.current && !containerRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if(listRef.current && highlightIndex >= 0 && listRef.current.children[highlightIndex]) {
            listRef.current.children[highlightIndex].scrollIntoView({
                block: 'nearest'
            });
        }
    }, [highlightIndex]);

    async function handleSelect(item) {
        setInputValue(item[labelField]);
        setShowDropdown(false);
        setHighlightIndex(-1);
        onSelect && await onSelect();
        setValue(item.id);
    };

    async function handleCreate() {
        try {
            setIsLoading(true);
            const newObj = { [labelField]: inputValue };
            const id = await onCreate(newObj);
            if(id) {
                AlertService.fastSuccess();
                refresh();
                setValue(id);
                setShowDropdown(false);
                onSelect && onSelect();
            }
        } catch(err) {
            console.error('Erro ao criar:', err);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleKeyDown(e) {
        if(e.key === 'Enter') {
            e.preventDefault();
            if(showDropdown && highlightIndex >= 0) {
                return handleSelect(filteredSuggestions[highlightIndex]);
            }
            if(isNewEntry) {
                return await handleCreate();
            }
        }
        if(e.key === 'ArrowDown') {
            e.preventDefault();
            if(!showDropdown) {
                setShowDropdown(true);
                return;
            }
            setHighlightIndex(prev => Math.min(prev + 1, filteredSuggestions.length - 1));
        }
        if(e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightIndex(prev => Math.max(prev - 1, 0));
        }
    }

    return (
        <div ref={containerRef} 
            style={{ position: 'relative', width }}
        >
            <input type='text'
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder={placeholder}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                    if(filteredSuggestions.length > 0) {
                        setShowDropdown(true);
                    }
                }}
                className={`
                    p-3 w-full
                    border border-border rounded-xl
                    hover:ring-1 hover:ring-primary
                    focus:ring-1 focus:ring-primary focus:outline-0
                `}
            />
            <div>
                {isLoading && <span className='absolute right-[15px] top-1/2 -translate-y-1/2'>
                    <SpinLoader />    
                </span>}
                {isNewEntry && !isLoading && <div className={`
                    absolute right-[18px] top-1/2 -translate-y-1/2
                    bg-primary w-2 h-2 rounded-full
                `}/>}
                {!isNewEntry && !isLoading && inputValue && <span className={`
                    text-primary absolute right-[15px] top-1/2 -translate-y-1/2    
                `}>
                    <ICONS.check />
                </span>}
            </div>
            {showDropdown && filteredSuggestions.length > 0 && <ul
                ref={listRef}
                className={`
                    absolute top-[calc(50px+4px)]
                    w-full max-h-[150px] m-0 p-0
                    bg-white border border-gray-300
                    rounded-lg shadow-md
                    overflow-hidden z-10
                `}
            >
                <div className='max-h-[150px] overflow-y-auto'>
                    {filteredSuggestions.map((item, index) => (
                        <li key={index}
                            onClick={() => handleSelect(item)}
                            onMouseDown={(e) => e.preventDefault()}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            className={`
                                px-3 py-2 cursor-pointer
                                transition-colors duration-200 
                                ${highlightIndex === index
                                    ? 'bg-gray-100'
                                    : 'bg-transparent'}
                            `}
                        >
                            {item[labelField]}
                        </li>
                    ))}
                </div>
            </ul>}
        </div>
    );
}