'use server'
import { createClient } from '@/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function login(user){
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword(user);
    if(error){
        console.log(error);
    }else{
        revalidatePath(`/`, 'layout');
        redirect(`/`);
    }
}

export async function logout(){
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if(error){
        console.log(error);
    }
    revalidatePath('/login', 'layout');
    redirect('/login');
}