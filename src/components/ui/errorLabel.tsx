import React from 'react'

type Props = {
    children: string;
};

const ErrorLabel = ({ children }: Props) => {
    return (
        <span className="text-red-500">{children}</span>
    )
}

export default ErrorLabel