"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";





export default function RegisterPage(){
    const router = useRouter()
    const [form,setForm] = useState({
        name:"",
        email:"",
        password:""
    })
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState("")

    async function handleRegister(e:React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError("")

        try{
            const res = await fetch("/api/auth/register",{
            method:"POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        })

        const data = await res.json()
        
        if(data.status !== 201){
            setError(data.message+data.status|| "Registration Failed")
            setLoading(false)
            return
        }
        setLoading(false)
        router.push("/login")
        }catch(err){
            setError("Server Error")
            setLoading(false)
        }
        
    }
    return(
        <div className="max-w-md mx-auto mt-10 border p-6 rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Register</h1>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form onSubmit={handleRegister} className="space-y-3">
        <input
          type="text"
          placeholder="Name"
          className="w-full border px-3 py-2 rounded"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          type="email"
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
          {loading ? "Creating..." : "Register"}
        </button>
      </form>
    </div>
    )

}