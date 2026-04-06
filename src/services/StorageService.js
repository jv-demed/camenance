import { supabase } from '@/supabase/client';

export const StorageService = {

    /**
     * Faz upload de um arquivo e retorna o path no bucket.
     */
    async upload(bucket, userId, encounterId, file) {
        const ext = file.name.split('.').pop();
        const path = `${userId}/${encounterId}/${Date.now()}.${ext}`;
        const { error } = await supabase.storage
            .from(bucket)
            .upload(path, file, { upsert: false });
        if (error) throw new Error(error.message);
        return { bucket, path };
    },

    /**
     * Retorna uma URL assinada (funciona com buckets privados).
     * expiresIn em segundos — padrão 1 hora.
     */
    async getUrl(bucket, path, expiresIn = 3600) {
        const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
        if (error) throw new Error(error.message);
        return data?.signedUrl ?? null;
    },

    /**
     * Remove um arquivo do storage.
     */
    async remove(bucket, path) {
        const { error } = await supabase.storage.from(bucket).remove([path]);
        if (error) throw new Error(error.message);
    },

};
