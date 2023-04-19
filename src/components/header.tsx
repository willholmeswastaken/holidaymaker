import { MainNav } from './main-nav';
import { Button } from './ui/button';
import { useMemo } from 'react';
import { UserAccountNav } from './user-account-nav';
import { signIn, useSession } from 'next-auth/react';

function Header() {
    const { data: sessionData, } = useSession();
    const isAuthenticated = useMemo<boolean>(() => sessionData?.user !== null && sessionData?.user !== undefined, [sessionData]);
    const onLogIn = () => {
        void signIn(undefined, { callbackUrl: `${window.location.origin}/scrapbook` });
    }

    return (
        <header className="px-6 sticky top-0 z-40 bg-white dark:bg-slate-900 w-full">
            <div className="flex h-16 items-center justify-between border-b border-b-slate-200 dark:border-none py-4">
                <MainNav items={[
                    {
                        title: 'Scrapbook',
                        href: '/scrapbook',
                        requiresAuth: true
                    }
                ]} isAuthenticated={isAuthenticated} />
                {
                    isAuthenticated && sessionData?.user ? (
                        <UserAccountNav
                            user={{
                                name: sessionData.user.name,
                                image: sessionData.user.image,
                                email: sessionData.user.email,
                            }}
                        />
                    ) : (
                        <Button onClick={onLogIn}>Login</Button>
                    )
                }
            </div>
        </header>
    );
}

export default Header;