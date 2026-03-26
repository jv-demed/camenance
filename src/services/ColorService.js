export class ColorService {

    static toHexString(color) {
        if(typeof color === 'number') return color.toString(16).padStart(6, '0');
        return String(color);
    }

    static numberToHex(color) {
        return '#' + ColorService.toHexString(color);
    }

    static getContrastColor(color) {
        const hex = ColorService.toHexString(color);
        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;
        const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        return luminance > 0.5 ? '#464646' : '#FFFFFF';
    }

}