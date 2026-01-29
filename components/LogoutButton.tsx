"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function LogoutButton() {
  const { user,logout } = useAuth();
  const router = useRouter();

  const handleLogout = async() => {
    await logout();
    router.replace("/login"); // ✅ redirect after logout
  };

  return (
    <>
    {user?(
        <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded-lg"
    >
      Logout
    </button>
    ):(
       <button
      onClick={()=>router.replace("/login")}
      className="px-4 py-2 bg-red-600 text-white rounded-lg"
    >
      Login
    </button> 
    )}
    
    </>
    
  );
}
