import Select from 'react-select';
import { TagBox } from '@/components/elements/TagBox';

export function DropdownMultiInput({
    items = [],
    values = [],
    setValues,
    placeholder = 'Selecione...',
    displayField = 'name',
    valueField = 'id',
    width = '100%',
    defaultColor = '#e5e7eb'
}) {

    const options = items.map(item => ({
        value: item[valueField],
        label: item[displayField],
        color: item.color,
    }));

    const safeValues = values ?? [];
    const selectedOptions = options.filter(opt => safeValues.some(v => v == opt.value));

    const handleTagClick = (valueToRemove) => {
        const newValues = safeValues.filter(val => val != valueToRemove);
        setValues && setValues(newValues);
    };

    const CustomMultiValue = (props) => {
        const { data } = props;
        return (
            <div
                style={{ cursor: 'pointer' }}
                onClick={() => handleTagClick(data.value)}
            >
                <TagBox
                    tag={{ title: data.label, color: data.color ?? defaultColor }}
                    fontSize="0.875rem"
                    paddingHorizontal="10px"
                    paddingVertical="4px"
                />
            </div>
        );
    };

    const customStyles = {
        control: (base, state) => ({
            ...base,
            border: '1px solid #d1d5dc',
            borderRadius: '12px',
            boxShadow: state.isFocused
                ? '0 0 0 1px #3b82f6'
                : base.boxShadow,
            minHeight: '50px',
            outline: state.isFocused ? 'none' : undefined,
            '&:hover': {
                boxShadow: '0 0 0 1px #3b82f6',
            },
            padding: '2px',
        }),
        option: (styles, { isFocused }) => ({
            ...styles,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: isFocused ? '#eee' : 'white',
            color: 'black',
        }),
        valueContainer: (styles) => ({
            ...styles,
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
        }),
    };

    return (
        <div style={{ width }}>
            <Select
                isMulti
                placeholder={placeholder}
                noOptionsMessage={() => 'Nenhum resultado encontrado'}
                options={options}
                value={selectedOptions}
                onChange={(selected) =>
                    setValues && setValues(selected.map(item => item.value))
                }
                styles={customStyles}
                components={{ MultiValue: CustomMultiValue }}
            />
        </div>
    );
}