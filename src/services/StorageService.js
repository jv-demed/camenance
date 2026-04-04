import { supabase } from '@/supabase/client';

const BUCKET = 'encounter-photos';

export const StorageService = {

    /**
     * Faz upload de um arquivo e retorna o path no bucket.
     */
    async upload(userId, encounterId, file) {
        const ext = file.name.split('.').pop();
        const path = `${userId}/${encounterId}/${Date.now()}.${ext}`;
        const { error } = await supabase.storage
            .from(BUCKET)
            .upload(path, file, { upsert: false });
        if (error) throw new Error(error.message);
        return { bucket: BUCKET, path };
    },

    /**
     * Retorna a URL pública (ou assinada) de uma foto.
     */
    getUrl(path) {
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        return data?.publicUrl ?? null;
    },

    /**
     * Remove um arquivo do storage.
     */
    async remove(path) {
        const { error } = await supabase.storage.from(BUCKET).remove([path]);
        if (error) throw new Error(error.message);
    },

};
