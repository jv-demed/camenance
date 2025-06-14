'use client'
import { createContext, useContext } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { SpinLoader } from '@/components/elements/SpinLoader';
import { Main } from '@/components/containers/Main';

export const UserContext = createContext(null);

export function UserProvider({ children }){
    const user = useAuth();
    if(user.loading){
        return (
            <Main>
                <SpinLoader />
            </Main>
        )
    }
    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => {
    return useContext(UserContext);
};