import { ReactNode } from 'react';

export default function Main({children}: MainProps) {
    return (
        <main className='flex flex-col flex-1 p-4 sm:p-8'>
            {children}
        </main>
    )
}

interface MainProps {
    children?: ReactNode
}