"use client"
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export default function Login() {
  const router = useRouter()
  const [form,setForm] = useState({
    email:"",
    password:""
  })
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState("")

  async function handleLogin(e:React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    if(!form.email.trim() || !form.password.trim()){
      setError("Email and password is required.")
      setLoading(false)
      return
    }
    try{
      const res = await fetch("/api/auth/login",{
            method:"POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        })
      const result = await res.json()
      if(result.status!== 200){
        setError(result.message || "Login Failed")
        setLoading(false)
        return
      }
      setLoading(false)
      // Full page reload to ensure AuthContext picks up the new token and triggers cart sync
      window.location.href = '/'


    }catch(error){
      console.log(error)
    }
    
  }
  return (
    <div className="max-w-md mx-auto mt-10 border p-6 rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form onSubmit={handleLogin} className="space-y-3">
        <input
          type="text"
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border px-3 py-2 rounded"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Logging..." : "Login"}
        </button>
      </form>
    </div>

  )
}
