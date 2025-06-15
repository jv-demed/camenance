export function TagBox({ 
    tag,
    fontSize,
    paddingHorizontal,
    paddingVertical
}) {

    function getContrastTextColor(hexColor) {
        const hex = hexColor.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;
        const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        return luminance > 0.5 ? '#464646' : '#FFFFFF';
    }

    return (
        <span 
            style={{
                backgroundColor: tag.color,
                color: getContrastTextColor(tag.color),
                fontSize: fontSize,
                paddingTop: paddingVertical,
                paddingBottom: paddingVertical,
                paddingLeft: paddingHorizontal,
                paddingRight: paddingHorizontal,
            }}
            className='rounded-full'
        >
            {tag.name}
        </span>
    )
}