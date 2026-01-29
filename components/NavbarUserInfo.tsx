"use client";

import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

export default function NavbarUserInfo() {
  const { user, loading } = useAuth();
  

  if (loading) return null;

  return (
    <nav>
      {user ? (
        <span>{user.name}</span>
      ) : (
        <span className="hidden"></span>
      )}
    </nav>
  );
}
