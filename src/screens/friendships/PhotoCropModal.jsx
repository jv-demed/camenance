'use client'
import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { DefaultBtn } from '@/components/buttons/DefaultBtn';
import { ICONS } from '@/assets/icons';

async function createImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener('load', () => resolve(img));
        img.addEventListener('error', reject);
        img.src = src;
    });
}

async function getCroppedBlob(imageSrc, pixelCrop) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    canvas.getContext('2d').drawImage(
        image,
        pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
        0, 0, pixelCrop.width, pixelCrop.height,
    );
    return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.92));
}

export function PhotoCropModal({ imageSrc, onConfirm, onCancel }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((_, pixels) => {
        setCroppedAreaPixels(pixels);
    }, []);

    async function handleConfirm() {
        const blob = await getCroppedBlob(imageSrc, croppedAreaPixels);
        const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
        onConfirm(file);
    }

    return (
        <div className='fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-[60] gap-5 px-6'>

            <div className='relative w-full max-w-sm aspect-square rounded-xl overflow-hidden'>
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                />
            </div>

            <input
                type='range'
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={e => setZoom(Number(e.target.value))}
                className='w-full max-w-sm accent-primary'
            />

            <div className='flex gap-3'>
                <DefaultBtn text='Cancelar' onClick={onCancel} bg='bg-gray-500' width='120px' />
                <DefaultBtn text='Confirmar' icon={ICONS.check} onClick={handleConfirm} width='120px' />
            </div>

        </div>
    );
}
