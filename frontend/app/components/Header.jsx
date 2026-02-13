"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const start = localStorage.getItem("name").split(" ")[0].charAt(0).toUpperCase();
  const end = localStorage.getItem("name").split(" ")[0].slice(1).toLowerCase();

  const name = start+end;

  const token = typeof window !== "undefined"
    ? localStorage.getItem("token")
    : null;

  return (
    <header className="p-6 text-white">
      {token && (
        <div className="flex flex-row justify-between">
          <div className="px-2 py-1">
            Welcome, {name}!
          </div>
          <div className="flex flex-row gap-5">
            <Link href="/dashboard" className="px-2 py-1">
                Dashboard
            </Link>
            <button 
                className="rounded-md px-2 py-1 bg-red-600 border-white border-2 hover:bg-red-700 duration-100 cursor-pointer"
                onClick={handleLogout}
            >
                Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
