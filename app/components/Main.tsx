import { ReactNode } from 'react';

export default function Main({children}: MainProps) {
    return (
        <main className='flex-1 flex flex-col'>
            {children}
        </main>
    )
}

interface MainProps {
    children?: ReactNode
}