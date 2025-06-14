import { UserProvider } from '@/context/UserContext';
import '@/styles/globals.css';

export default function RootLayout({ children }) {
    return (
        <html lang='pt-br'>
            <body>
                <UserProvider>
                    {children}
                </UserProvider>
            </body>
        </html>
    );
}