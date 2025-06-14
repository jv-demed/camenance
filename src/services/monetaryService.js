export function getBrValue(value){
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}