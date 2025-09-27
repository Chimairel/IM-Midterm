"use client";

import { signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    // Clear any existing session before login
    await signOut({ redirect: false });

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      // Display a more specific error
      const errorMessage = res.error === 'CredentialSignin'
        ? 'Login failed: Invalid credentials or server error.'
        : `Login failed: ${res.error}`;

      alert(errorMessage);
    } else {
      router.push("/profile");
    }
  }

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/profile" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        // INCREASED main spacing to space-y-6 to separate buttons from fields
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6" 
      >
        <h1 className="text-2xl font-bold text-center text-black">Login</h1>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="text-black w-full px-4 py-2 border rounded-lg focus:ring-black focus:border-black" 
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="text-black w-full px-4 py-2 border rounded-lg focus:ring-black focus:border-black"
        />

        {/* Primary Black Button */}
        <button
          type="submit"
          className="w-full bg-black hover:bg-gray-800 text-white py-2 rounded-lg font-semibold transition"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        
        {/* Google Button - REMOVED the specific mt-3 margin to make it closer to Login */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition" 
        >
          Sign in with Google
        </button>

        <p className="text-center text-sm text-gray-500 mt-2">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-black hover:text-gray-700 hover:underline font-semibold" 
          >
            Sign Up
          </Link>
        </p>

      </form>
    </div>
  );
}