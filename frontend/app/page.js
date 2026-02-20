"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRegister, setshowRegister] = useState(false);

  const router = useRouter();

  const handleLogin = async (e) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await res.json();
    console.log("user data -->", data);

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.user.name);
      localStorage.setItem("email", data.user.email);
      router.push("/dashboard");
    } else {
      alert(data.message);
    }
  };

  const handleRegister = async (e) => {
    if (password !== confirmPassword) {
      return alert("Passwords do not match!");
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      return alert("Email is not valid!");
    }
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.user.name);
      localStorage.setItem("email", data.user.email);
      router.push("/dashboard");
    } else {
      alert(data.message);
    }
  };

  return (
    <div
      className={`fixed inset-0 backdrop-blur-md z-40 w-full h-full bg-linear-to-r from-[#3F5EFB] to-[#FC466B]`}
    >
      <div className="fixed z-50 inset-0 flex flex-col gap-5 items-center justify-center">
        {!showRegister ? (
          <h2 className="text-white text-[24px]">
            Please login to continue using task dashboard
          </h2>
        ) : null}
        <div className="bg-[#ffffff15] flex flex-col justify-between items-center gap-5 rounded-lg border-2 border-white p-10 shadow-2xl">
          <h2 className="text-white mb-5">
            {showRegister ? "REGISTER" : "LOGIN"}
          </h2>
          <div className="flex flex-col items-center">
            {showRegister && (
              <>
                <input
                  className="w-70 text-white border-2 border-[#ffffffa2] p-2 rounded-md focus:outline-[#ffffff]"
                  type="text"
                  placeholder="Name"
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <br />
              </>
            )}
            <input
              className="w-70 text-white border-2 border-[#ffffffa2] p-2 rounded-md focus:outline-[#ffffff]"
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <br />
            <input
              className="w-70 text-white border-2 border-[#ffffffa2] p-2 rounded-md focus:outline-[#ffffff]"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <br />
            {showRegister && (
              <>
                <input
                  className="w-70 text-white border-2 border-[#ffffffa2] p-2 rounded-md focus:outline-[#ffffff]"
                  type="password"
                  placeholder="Confirm Password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <br />
              </>
            )}
            {showRegister ? (
              <button
                className="bg-[#d5d5d53f] w-40 cursor-pointer text-white rounded-lg px-2 py-1 border-2 border-[#ffffffa2] hover:border-white hover:bg-[#d5d5d588] duration-100"
                onClick={handleRegister}
              >
                Register
              </button>
            ) : (
              <button
                className="bg-[#d5d5d53f] w-40 cursor-pointer text-white rounded-lg px-2 py-1 border-2 border-[#ffffffa2] hover:border-white hover:bg-[#d5d5d588] duration-100"
                onClick={handleLogin}
              >
                Login
              </button>
            )}
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-white">
              {" "}
              {showRegister
                ? "Already have an account?"
                : "Do not have an account?"}
            </p>
            <button
              onClick={() => setshowRegister(!showRegister)}
              className="w-44.5 cursor-pointer text-white px-2 py-1 border-2 border-[#ffffffa2] hover:border-white hover:bg-[#d5d5d53f] duration-100"
            >
              {showRegister ? "Login" : "Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
