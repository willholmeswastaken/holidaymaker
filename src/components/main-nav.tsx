"use client"

import React, { useEffect, useMemo } from "react"
import Link from "next/link"

import { cn } from "@/utils/cn"
import { Icons } from "@/components/icons"
import { MobileNav } from "@/components/mobile-nav"
import { type NavItem } from "@/types/MainNavItem"
import { useRouter } from "next/router"
import Image from "next/image"

interface MainNavProps {
    items: NavItem[]
    children?: React.ReactNode
    isAuthenticated: boolean
}

export function MainNav({ items, children, isAuthenticated }: MainNavProps) {
    const { route } = useRouter();
    const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false)
    const itemsToDisplay = useMemo<NavItem[]>(() => {
        if (isAuthenticated) {
            return items;
        }
        return items?.filter(x => !x.requiresAuth);
    }, [isAuthenticated, items]);

    useEffect(() => {
        setShowMobileMenu(false);
    }, [route]);

    return (
        <div className="flex gap-6 md:gap-10">
            <Link href="/" className="hidden items-center space-x-2 md:flex dark:text-white">
                <div className="w-8 h-8">
                    <Image
                        src="/logo.jpeg"
                        alt='Holiday maker logo'
                        width={100}
                        height={100}
                        className='object-contain rounded-full' />
                </div>
                <span className="hidden font-bold sm:inline-block">
                    HolidayMaker
                </span>
            </Link>
            {items?.length ? (
                <nav className="hidden gap-6 md:flex">
                    {itemsToDisplay.map((item, index) => (
                        <Link
                            key={index}
                            href={item.disabled ? "#" : item.href}
                            className={cn(
                                "flex items-center text-lg font-semibold text-slate-600 dark:text-slate-300 sm:text-sm",
                                item.href === `${route}` && "text-slate-900 dark:text-white",
                                item.disabled && "cursor-not-allowed opacity-80"
                            )}
                        >
                            {item.title}
                        </Link>
                    ))}
                </nav>
            ) : null}
            <button
                className="flex items-center space-x-2 md:hidden dark:text-white"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
                {showMobileMenu ? <Icons.close /> : <Icons.burger />}
                <span className="font-bold">HolidayMaker</span>
            </button>
            {showMobileMenu && items && (
                <MobileNav items={items} isAuthenticated={isAuthenticated}>{children}</MobileNav>
            )}
        </div>
    )
}
