import Select from 'react-select';

export function DropdownInput({
    items = [],
    value,
    setValue,
    placeholder = 'Selecione...',
    displayField = 'name',
    valueField = 'id',
    required = false,
    width = '100%'
}) {

    const customStyles = {
        control: (base, state) => ({
            ...base,
            border: '1px solid #d1d5dc',
            borderRadius: '12px',
            boxShadow: state.isFocused
                ? '0 0 0 1px #3b82f6'
                : base.boxShadow,
            height: '50px',
            minHeight: '50px',
            outline: state.isFocused ? 'none' : undefined,
            '&:hover': {
                boxShadow: '0 0 0 1px #3b82f6'
            }
        }),
        option: (styles, { data, isFocused }) => ({
            ...styles,
            alignItems: 'center',
            backgroundColor: isFocused ? '#eee' : 'white',
            color: 'black',
            display: 'flex',
        }),
        singleValue: (styles, { data }) => ({
            ...styles,
            alignItems: 'center',
            display: 'flex',
        }),
    };

    const options = items.map(item => ({
        value: item[valueField],
        label: item[displayField],
        color: item.color,
    }));

    function formatOptionLabel({ label, color }) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {color && <span
                    style={{
                        backgroundColor: color,
                        borderRadius: '50%',
                        display: 'inline-block',
                        height: 10,
                        width: 10,
                    }}
                />}
                {label}
            </div>
        );
    } 

    return (
        <div style={{ width }}>
            <Select
                placeholder={placeholder}
                noOptionsMessage={() => 'Nenhum resultado encontrado'}
                options={options}
                value={options.find(opt => opt.value === value)}
                onChange={option => setValue && setValue(option.value)}
                formatOptionLabel={formatOptionLabel}
                isRequired={required}
                styles={customStyles}
            />
        </div>
    );
}