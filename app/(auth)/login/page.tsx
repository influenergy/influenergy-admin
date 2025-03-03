"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Reducer } from "@reduxjs/toolkit";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../../store/slices/authSlice";
import { api } from "../../../utils/apiConfig";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter(); // Initialize router for redirection

  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      
      const res = await api.post("/login", {
        email: formData.email,
        password: formData.password,
        userType: "admin", // Default userType
      });
  
      const data = res.data; // Axios already parses JSON response
      console.log(data);
  
      dispatch(
        login({
          fullName: data.data.fullName,
          email: data.data.companyEmail,
        })
      );
  
      alert("Login successful!");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md rounded-2xl bg-white/10 p-8 shadow-lg backdrop-blur-md"
      >
        <h2 className="mb-6 text-center text-2xl font-bold text-white">
          Admin Login
        </h2>
        {error && <p className="mb-4 text-center text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border-none bg-gray-800 p-3 pl-10 text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </motion.div>

          {/* Password Input */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border-none bg-gray-800 p-3 pl-10 text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </motion.div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 p-3 text-white transition-all duration-300 hover:bg-blue-700 disabled:bg-gray-500"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        {/* Footer Links */}
        <div className="mt-4 text-center text-sm text-gray-400">
          <p>
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-blue-400 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
