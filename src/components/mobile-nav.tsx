import { useMemo } from "react"
import Link from "next/link"
import Image from 'next/image'
import { useLockBody } from "@/hooks/use-lock-body"

import { cn } from "@/utils/cn"
import { type NavItem } from "@/types/MainNavItem"

interface MobileNavProps {
    items: NavItem[]
    children?: React.ReactNode
    isAuthenticated: boolean
}

export function MobileNav({ items, children, isAuthenticated }: MobileNavProps) {
    useLockBody()
    const itemsToDisplay = useMemo<NavItem[]>(() => {
        if (isAuthenticated) {
            return items;
        }
        return items?.filter(x => !x.requiresAuth);
    }, [isAuthenticated, items]);

    return (
        <div
            className={cn(
                "fixed inset-0 top-2 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 mt-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden"
            )}
        >
            <div className="relative z-20 grid gap-6 rounded-md bg-white p-4 shadow-md">
                <Link href="/" className="flex items-center space-x-2">
                    <Image
                        src="/logo.jpeg"
                        alt='Holiday maker logo'
                        width={25}
                        height={25}
                        className='object-contain rounded-full' />
                    <span className="font-bold">HolidayMaker</span>
                </Link>
                <nav className="grid grid-flow-row auto-rows-max text-sm">
                    {itemsToDisplay.map((item, index) => (
                        <Link
                            key={index}
                            href={item.disabled ? "#" : item.href}
                            className={cn(
                                "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline",
                                item.disabled && "cursor-not-allowed opacity-60"
                            )}
                        >
                            {item.title}
                        </Link>
                    ))}
                </nav>
                {children}
            </div>
        </div>
    )
}
