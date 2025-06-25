'use client'
import { usePathname } from 'next/navigation';
import { UserProvider } from '@/context/UserContext';
import { Sidebar } from '@/presentation/sidebar/Sidebar';
import '@/styles/globals.css';

export default function RootLayout({ children }) {

    const pathname = usePathname();
    const hideSidebarRoutes = ['/login'];
    const shouldShowSidebar = !hideSidebarRoutes.includes(pathname);

    return (
        <html lang='pt-br'>
            <body>
                <UserProvider>
                    <div className='flex'>
                        {shouldShowSidebar && <Sidebar />}
                        <div className='flex justify-center w-full'>
                            {children} 
                        </div>
                    </div>
                </UserProvider>
            </body>
        </html>
    );
}