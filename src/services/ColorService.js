export class ColorService {

    static getContrastColor(hexNumber) {
        const string = String(hexNumber);
        const r = parseInt(string.substring(0, 2), 16) / 255;
        const g = parseInt(string.substring(2, 4), 16) / 255;
        const b = parseInt(string.substring(4, 6), 16) / 255;
        const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        return luminance > 0.5 ? '#464646' : '#FFFFFF';
    }

    static numberToHex(hexNumber) {
        return '#'+hexNumber;
    }

}