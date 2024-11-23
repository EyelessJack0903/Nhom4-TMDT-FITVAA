import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import Logo from "./Logo";
export default function Nav({ show }) {
    const inactiveLink = 'flex gap-1 p-1 ';
    const activeLink = inactiveLink + 'bg-highlight text-black rounded-sm';
    const inactiveIcon = 'w-6 h-6';
    const activeIcon = inactiveIcon + ' text-primary';
    const router = useRouter();
    const { pathname } = router;
    async function logout() {
        await router.push('/');
        await signOut();
    }
    return (
        <aside className={(show ? 'left-0' : '-left-full') + " top-0 text-gray-500 p-4 fixed w-full bg-bgGray h-full md:static md:w-auto transition-all"}>
            <div className="mb-8 mr-4">
                <Logo />
            </div>

            <nav className="flex flex-col gap-2">
                <Link href={'/'} className={pathname === '/' ? activeLink : inactiveLink}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={pathname === '/' ? activeIcon : inactiveIcon}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    Dashboard
                </Link>

                <Link href={'/products'} className={pathname.includes('/products') ? activeLink : inactiveLink}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={pathname.includes('/products') ? activeIcon : inactiveIcon}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                    </svg>
                    Products
                </Link>

                <Link href={'/categories'} className={pathname.includes('/categories') ? activeLink : inactiveLink}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={pathname.includes('/categories') ? activeIcon : inactiveIcon}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                    Categories
                </Link>

                <Link href={'/orders'} className={pathname.includes('/orders') ? activeLink : inactiveLink}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={pathname.includes('/orders') ? activeIcon : inactiveIcon}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 4.5h10.5M9 4.5h-.008v.008H9V4.5Zm6 0h-.008v.008H15V4.5ZM9.75 9h4.5m-4.5 3h4.5m-9 8.25V7.153c0-.65 0-.975.092-1.231a1.125 1.125 0 0 1 .63-.63C6.627 5.25 6.953 5.25 7.602 5.25h8.796c.65 0 .975 0 1.231.092.29.124.506.34.63.63.092.256.092.582.092 1.231v13.097l-3.9-2.028c-.274-.142-.41-.213-.553-.24a1.124 1.124 0 0 0-.396 0c-.143.027-.279.098-.553.24l-3.9 2.028Z" />
                    </svg>
                    Orders
                </Link>


                <Link href={'/users'} className={pathname.includes('/settings') ? activeLink : inactiveLink}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={pathname.includes('/settings') ? activeIcon : inactiveIcon}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.5 19.5a8.25 8.25 0 0 1 15 0" />
                    </svg>
                    Users
                </Link>

                <button onClick={() => signOut()} className={inactiveLink}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                    </svg>
                    Logout
                </button>
            </nav>
        </aside>
    );
}