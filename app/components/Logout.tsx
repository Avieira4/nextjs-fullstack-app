'use client'
import { AuthObj, useAuth } from "@/context/AuthContext"
import Button from "./Button"
import { usePathname } from "next/navigation"
import Link from "next/link"

export default function Logout() {
    const { logout, currentUser }: AuthObj = useAuth()
    const pathName = usePathname()


    if(!currentUser){
        return null
    }

    if(pathName === '/')
        return (
            <Link href={'/dashboard'}>
                <Button text="Go to dashboard"></Button>
            </Link>

        )
    return (
        <Button text="Logout" clickHandler={logout}></Button>
    )
}