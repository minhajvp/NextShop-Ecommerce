"use client"

import { createContext, useContext, useEffect, useState } from "react"


type User = {
    id: string,
    name: string,
    email: string
}

type AuthContextType = {
    user: User | null
    loading: boolean
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)


export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(false)

    async function refreshUser() {
        setLoading(true)
        try {
            const res = await fetch("/api/auth/me")
            const data = await res.json()
            setUser(data.user)

        } catch (error) {
            setUser(null)
        }
        setLoading(false)

    }
    useEffect(() => {
        refreshUser()
    }, [])

    return (
        <>
            <AuthContext.Provider value={{ user, loading, refreshUser }}>
                {children}
            </AuthContext.Provider>
        </>
    )



}

export function useAuth(){
    const cntx = useContext(AuthContext);
    if(!cntx){
        throw new Error("useAuth must be used inside AuthProvider")
    }
    return cntx
}