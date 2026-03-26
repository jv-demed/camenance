import { ColorService } from '@/services/ColorService';

describe('ColorService', () => {

    describe('toHexString', () => {
        it('converte número para hex com padding', () => {
            expect(ColorService.toHexString(255)).toBe('0000ff');
            expect(ColorService.toHexString(0)).toBe('000000');
            expect(ColorService.toHexString(16777215)).toBe('ffffff');
        });

        it('retorna string sem alterar', () => {
            expect(ColorService.toHexString('abc123')).toBe('abc123');
        });
    });

    describe('numberToHex', () => {
        it('converte número para formato #rrggbb', () => {
            expect(ColorService.numberToHex(16711680)).toBe('#ff0000'); // vermelho
            expect(ColorService.numberToHex(65280)).toBe('#00ff00');   // verde
            expect(ColorService.numberToHex(255)).toBe('#0000ff');     // azul
        });
    });

    describe('getContrastColor', () => {
        it('retorna cor escura para fundo claro', () => {
            expect(ColorService.getContrastColor('ffffff')).toBe('#464646'); // branco
            expect(ColorService.getContrastColor('ffff00')).toBe('#464646'); // amarelo
        });

        it('retorna cor clara para fundo escuro', () => {
            expect(ColorService.getContrastColor('000000')).toBe('#FFFFFF'); // preto
            expect(ColorService.getContrastColor('0000ff')).toBe('#FFFFFF'); // azul escuro
        });

        it('funciona com número como entrada', () => {
            expect(ColorService.getContrastColor(16777215)).toBe('#464646'); // 0xFFFFFF = branco
            expect(ColorService.getContrastColor(0)).toBe('#FFFFFF');        // 0x000000 = preto
        });
    });

});
