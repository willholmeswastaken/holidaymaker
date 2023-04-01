import clsx from 'clsx';
import React from 'react'

type HeaderProps = {
    children: string;
    className?: string;
}

const Header = ({ children, className }: HeaderProps) => {
    return (
        <h1 className={clsx('text-3xl dark:text-white text-slate-700', className)}>{children}</h1>
    )
}

export default Header