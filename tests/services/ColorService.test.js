import { ColorService } from '@/services/ColorService';

describe('ColorService', () => {

    describe('getContrastColor', () => {
        it('retorna cor escura para fundo claro', () => {
            expect(ColorService.getContrastColor('#ffffff')).toBe('#464646'); // branco
            expect(ColorService.getContrastColor('#ffff00')).toBe('#464646'); // amarelo
        });

        it('retorna cor clara para fundo escuro', () => {
            expect(ColorService.getContrastColor('#000000')).toBe('#FFFFFF'); // preto
            expect(ColorService.getContrastColor('#0000ff')).toBe('#FFFFFF'); // azul escuro
        });

        it('funciona sem o # no início', () => {
            expect(ColorService.getContrastColor('ffffff')).toBe('#464646');
            expect(ColorService.getContrastColor('000000')).toBe('#FFFFFF');
        });
    });

});
