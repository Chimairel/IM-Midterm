"use client";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state for button control

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        name,
        email,
        password,
      });

      // Clear the form on successful registration
      setName("");
      setEmail("");
      setPassword("");
      alert("Account created! You can now log in.");
    } catch (err) {
      const errorMessage =
        err.response && err.response.data
          ? err.response.data.message || err.response.data.error || 'Check backend terminal for details.'
          : 'Network connection failed. Backend server may be down.';

      alert(`Error creating account: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8"> {/* Applied rounded-2xl for consistency */}
        <h1 className="text-2xl font-bold text-center mb-6 text-black">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="text-black w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black" // Added text-black and black focus ring
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="text-black w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black" // Added text-black and black focus ring
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="text-black w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black" // Added text-black and black focus ring
          />

          {/* --- THEME CHANGE: Primary Black Button --- */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition font-semibold"
            disabled={loading}
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-500">
          Already have an account?{" "}
          <Link 
            href="/login" 
            className="text-black hover:text-gray-700 hover:underline font-semibold" // Styled link to match theme
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}