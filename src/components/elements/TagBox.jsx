import { ColorService } from '@/services/ColorService';

export function TagBox({
    tag,
    fontSize,
    paddingHorizontal,
    paddingVertical
}) {
    return (
        <span
            style={{
                backgroundColor: tag.color,
                color: ColorService.getContrastColor(tag.color),
                fontSize: fontSize,
                paddingTop: paddingVertical,
                paddingBottom: paddingVertical,
                paddingLeft: paddingHorizontal,
                paddingRight: paddingHorizontal,
            }}
            className='rounded-full'
        >
            {tag.title}
        </span>
    )
}