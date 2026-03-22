'use server'
import { revalidatePath } from 'next/cache';
import { createServer } from '@/supabase/server';

export async function login(user) {
    const supabase = await createServer();
    if(!user?.email || !user?.password) {
        return { error: 'Email e senha são obrigatórios' };
    }
    const { error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: user.password
    });
    if(error) {
        return { error: error.message };
    }
    revalidatePath('/', 'layout');
    return { success: true };
}
    
export async function logout() {
    const supabase = await createServer();
    const { error } = await supabase.auth.signOut();
    if(error) {
        return { error: error.message };
    }
    revalidatePath('/login', 'layout');
    return { success: true };
}