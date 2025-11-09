import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, User } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Simple check (you can change this to check against DB later)
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/home");
    } else {
      setError("Invalid credentials. Try again!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-md text-center"
      >
        <h1 className="text-3xl font-bold text-indigo-600 mb-6">🔐 Library Admin Login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex items-center border rounded-xl px-3 py-2 bg-gray-50">
            <User className="text-indigo-500 mr-2" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-700"
              required
            />
          </div>

          <div className="flex items-center border rounded-xl px-3 py-2 bg-gray-50">
            <Lock className="text-indigo-500 mr-2" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-700"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 mt-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-gray-500 text-sm">
          Hint: <span className="font-semibold text-indigo-600">admin / admin123</span>
        </p>
      </motion.div>
    </div>
  );
}
