"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading" || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const user = session.user;

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-black flex items-center justify-center text-3xl font-bold text-white">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <h1 className="mt-4 text-2xl font-semibold text-black">
            {user?.name || "Anonymous User"}
          </h1>
          <p className="text-gray-500">{user?.email || "No email"}</p>

          <div className="mt-8 w-full space-y-3">
            <h2 className="text-lg font-semibold text-black mb-3">Manage Profile</h2>
            
            <div className="flex space-x-3">
                <button
                    onClick={() => router.push("/update-name")}
                    className="w-1/2 bg-black hover:bg-gray-800 text-white py-2 px-2 rounded-lg transition font-semibold text-sm"
                >
                    Update Name
                </button>
                <button
                    onClick={() => router.push("/reset-password")}
                    className="w-1/2 bg-black hover:bg-gray-800 text-white py-2 px-2 rounded-lg transition font-semibold text-sm"
                >
                    Change Password
                </button>
            </div>
          </div>

          <div className="mt-8 w-full space-y-3 pt-6 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}