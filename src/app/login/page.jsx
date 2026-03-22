'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/supabase/auth';
import { Main } from '@/components/containers/Main'
import { Form } from '@/components/containers/Form';
import { TextInput } from '@/components/inputs/TextInput';
import { DefaultBtn } from '@/components/buttons/DefaultBtn';

export default function LoginPage() {

    const router = useRouter();

    const [user, setUser] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState(null);

    async function handleSubmit() {
        setError(null);
        try {
            const res = await login(user);
            if(res?.error) {
                setError(res.error);
                return;
            }
            router.push('/');
        } catch(err) {
            setError('Erro inesperado');
        }
    }

    return (
        <Main>
            <h1>Login</h1>
            <Form 
                onSubmit={handleSubmit}
                width='w-60'
            >
                <TextInput 
                    placeholder='E-mail'
                    value={user.email}
                    setValue={e => setUser({ ...user, email: e })}
                    required
                />
                <TextInput
                    placeholder='Senha'
                    type='password'
                    value={user.password}
                    setValue={e => setUser({ ...user, password: e })}
                    required
                />
                <DefaultBtn 
                    text='Entrar'
                    type='submit'
                />
                {error && <span className='text-error'>
                    {error}    
                </span>}
            </Form>
        </Main>
    )
}