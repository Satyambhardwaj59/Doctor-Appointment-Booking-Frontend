"use client";

import { useState, useContext, type FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "@/context/AdminContext";
import { DoctorContext } from "@/context/DoctorContext";
import { assets } from "@/lib/assets";

interface AdminDoctorLoginProps {
  initialRole?: "Admin" | "Doctor";
}

export default function AdminDoctorLogin({
  initialRole = "Admin",
}: AdminDoctorLoginProps) {
  const [state, setState] = useState<"Admin" | "Doctor">(initialRole);
  const [email, setEmail] = useState(
    initialRole === "Admin" ? "admin@prescripto.com" : ""
  );
  const [password, setPassword] = useState(
    initialRole === "Admin" ? "Admin@123" : ""
  );
  const [loading, setLoading] = useState(false);

  const { setAToken, aToken, backendUrl } = useContext(AdminContext);
  const { setDToken, dToken } = useContext(DoctorContext);
  const router = useRouter();

  // If already logged in, redirect
  useEffect(() => {
    if (aToken) {
      router.push("/admin/dashboard");
    } else if (dToken) {
      router.push("/doctor/dashboard");
    }
  }, [aToken, dToken, router]);

  const switchRole = (newRole: "Admin" | "Doctor") => {
    setState(newRole);
    if (newRole === "Admin") {
      setEmail("admin@prescripto.com");
      setPassword("Admin@123");
    } else {
      setEmail("");
      setPassword("");
    }
  };

  const onSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (state === "Admin") {
        const { data } = await axios.post(backendUrl + "/api/admin/login", {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
          toast.success("Admin login successful");
          router.push("/admin/dashboard");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/doctor/login", {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("dToken", data.token);
          setDToken(data.token);
          toast.success("Doctor login successful");
          router.push("/doctor/dashboard");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 bg-gradient-to-b from-slate-50 to-indigo-50/30">
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-4 items-start p-8 min-w-[340px] sm:min-w-[420px] bg-white border border-gray-200 rounded-2xl text-gray-600 text-sm shadow-xl"
      >
        <div className="w-full text-center pb-2">
          <div className="flex justify-center mb-2">
            <Image
              src={assets.logo_one}
              alt="Docify"
              width={150}
              height={38}
              priority
            />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            <span className="text-indigo-600">{state}</span> Portal
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Sign in to access your administrative control panel
          </p>
        </div>

        <div className="w-full">
          <label className="text-xs font-semibold text-gray-700">Email Address</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-gray-300 rounded-lg w-full p-2.5 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="email"
            placeholder={state === "Admin" ? "admin@prescripto.com" : "doctor@example.com"}
            required
          />
        </div>

        <div className="w-full">
          <label className="text-xs font-semibold text-gray-700">Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-gray-300 rounded-lg w-full p-2.5 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white w-full py-2.5 rounded-lg text-base font-medium cursor-pointer transition-colors shadow-sm mt-2"
        >
          {loading ? "Authenticating..." : `Login as ${state}`}
        </button>

        <div className="w-full pt-3 border-t text-xs text-center text-gray-500">
          {state === "Admin" ? (
            <p>
              Are you a doctor?{" "}
              <button
                type="button"
                className="cursor-pointer text-indigo-600 hover:underline font-semibold"
                onClick={() => switchRole("Doctor")}
              >
                Doctor Login
              </button>
            </p>
          ) : (
            <p>
              Are you an administrator?{" "}
              <button
                type="button"
                className="cursor-pointer text-indigo-600 hover:underline font-semibold"
                onClick={() => switchRole("Admin")}
              >
                Admin Login
              </button>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
