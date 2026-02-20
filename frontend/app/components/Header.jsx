"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const [token, setToken] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedToken = localStorage.getItem("token");
    const storedName = localStorage.getItem("name");

    setToken(storedToken);

    if (storedName) {
      const firstName = storedName.split(" ")[0];
      const formatted =
        firstName.charAt(0).toUpperCase() +
        firstName.slice(1).toLowerCase();

      setName(formatted);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    router.push("/");
  };

  return (
    <header className="p-6 text-white">
      {token && (
        <div className="flex flex-row justify-between">
          <div className="px-2 py-1 text-[18px]">
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
