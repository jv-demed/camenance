'use client'
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabase/client';

export function useAuth() {

    const router = useRouter();

    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(() => {
        fetchUser().then(res => res && setUser(res));
    }, []);

    const fetchUser = async () => {
        const { data, error } = await supabase.auth.getUser();
        if(error || !data?.user){
            router.push('/login');
            return
        } 
        return data.user;
    };

    useEffect(() => {
        setLoading(true);
        fetchUser().then(res => {
            res && setUser(res);
            setLoading(false);
        });
    }, []);

    return { user, loading, refresh };
}