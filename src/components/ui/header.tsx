import React from 'react'

type HeaderProps = {
    children: string
}

const Header = ({ children }: HeaderProps) => {
    return (
        <h1 className='text-3xl dark:text-white text-slate-700'>{children}</h1>
    )
}

export default Header