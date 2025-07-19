import Select, { components } from 'react-select';
import { TagBox } from '../elements/TagBox';


export function DropdownMultiInput({
    items = [],
    values = [],
    setValues,
    placeholder = 'Selecione...',
    displayField = 'name',
    valueField = 'id',
    required = false,
    width = '100%',
    defaultColor = '#e5e7eb' // gray-200
}) {

    // Mapeia os dados recebidos para o formato do react-select
    const options = items.map(item => ({
        value: item[valueField],
        label: item[displayField],
        color: item.color,
    }));

    // Preenche as opções selecionadas com base nos valores
    const selectedOptions = options.filter(opt => values.includes(opt.value));

    // Quando clicar em uma tag, remove ela da seleção
    const handleTagClick = (valueToRemove) => {
        const newValues = values.filter(val => val !== valueToRemove);
        setValues && setValues(newValues);
    };

    // Substitui a renderização padrão da tag
    const CustomMultiValue = (props) => {
        const { data } = props;
        return (
            <div
                style={{ cursor: 'pointer' }}
                onClick={() => handleTagClick(data.value)}
            >
                <TagBox
                    tag={{ name: data.label, color: data.color || defaultColor }}
                    fontSize="0.875rem" // text-sm
                    paddingHorizontal="10px"
                    paddingVertical="4px"
                />
            </div>
        );
    };

    // Estilo do select
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
                isRequired={required}
            />
        </div>
    );
}