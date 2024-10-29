'use client'
import { auth, db } from '@/firebase'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, User, UserCredential } from 'firebase/auth'
import { doc, DocumentData, getDoc } from 'firebase/firestore'
import React from 'react'
import { useContext, useState, useEffect } from 'react'

const AuthContext = React.createContext()

export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider({ children }: any) {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [userDataObj, setUserDataObj] = useState<DocumentData | null>(null)
    const [loading, setLoading] = useState(true)

    //AUTH HANDLERS
    function signup(email: string, password: string){
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function login(email: string, password: string){
        return signInWithEmailAndPassword(auth, email, password)
    }

    function logout(){
        setUserDataObj(null)
        setCurrentUser(null)
        return signOut(auth)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async user => {
            try {
                // Set the user to our local context state
                setLoading(true)
                setCurrentUser(user)
                if(!user){
                    console.log("No user found")
                    return
                }
                // If user exists, fetch data from firestore database
                console.log("Fetching User Data")
                const docRef = doc(db, 'users', user.uid)
                const docSnap = await getDoc(docRef)
                let firebaseData = {}
                if(docSnap.exists()){
                    console.log("Found user Data")
                    firebaseData = docSnap.data()
                    console.log("Found user Data")
                }
                setUserDataObj(firebaseData)
            }catch(err: unknown){
                if (err instanceof Error) {
                    console.log(err.message)
                }
            } finally {
                setLoading(false)
            }
        })
        return unsubscribe
    }, [])

    const value = {
        currentUser,
        userDataObj,
        setUserDataObj,
        signup,
        logout,
        login,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}


/*
export interface AuthObj {
    currentUser: User | null,
    userDataObj: DocumentData | null, 
    setUserDataObj: React.Dispatch<React.SetStateAction<DocumentData | null>>,
    signup: (email: string, password: string) => Promise<UserCredential>,
    logout: () => Promise<void>,
    login: (email: string, password: string) => Promise<UserCredential>,
    loading: boolean
}
*/