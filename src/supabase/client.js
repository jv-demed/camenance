import { createBrowserClient } from '@supabase/ssr'

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY;

export function createClient(){
    return createBrowserClient(URL, KEY);
}

export const supabase = createClient();