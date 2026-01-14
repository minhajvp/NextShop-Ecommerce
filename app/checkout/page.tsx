import React, { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'

export default function page() {
    const {user,loading} = useAuth()
    const router = useRouter()

    useEffect(()=>{
        if(!loading && !user){
            router.push('/login')
        }

    },[loading,user])
    if (loading || !user) return null;
  return (
    <div>Checkout Page</div>
  )
}
