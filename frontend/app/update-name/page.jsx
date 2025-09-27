"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function UpdateNamePage() {
    const { data: session, status, update } = useSession();
    const router = useRouter();

    const [newName, setNewName] = useState("");
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);


    if (status === "loading" || status === "unauthenticated" || !session) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    const user = session.user;

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoadingUpdate(true);

        const trimmedName = newName.trim();

        if (trimmedName === "") {
            alert("New Name cannot be empty.");
            setLoadingUpdate(false);
            return;
        }
        if (trimmedName === user.name) {
            alert("New name must be different from your current name.");
            setLoadingUpdate(false);
            return;
        }

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            const accessToken = session.accessToken;

            const res = await axios.post(
                `${API_URL}/api/auth/profile-update`,
                { name: trimmedName },
                {
                    headers: { Authorization: `Bearer ${accessToken}` }
                }
            );

            alert(res.data.message + ". Please log in again to see your updated name.");

            setNewName("");
            await signOut({ redirect: false });
            router.push("/login");

        } catch (err) {
            console.error("Profile update error:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Failed to update profile.");
        } finally {
            setLoadingUpdate(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6 text-black">Update Name</h1>

                <form onSubmit={handleProfileUpdate} className="space-y-4">

                    {/* Field 1: Current Name (Read-only, Greying Design) - UPDATED STYLES HERE */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Name</label>
                        <input
                            type="text"
                            value={user.name}
                            readOnly
                            // Added bg-gray-200 and text-gray-700 for a more pronounced "unclickable" look
                            className="text-gray-700 w-full px-4 py-2 border rounded-lg bg-gray-200 cursor-not-allowed font-medium"
                        />
                    </div>

                    {/* Field 2: New Name (Editable) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Name</label>
                        <input
                            type="text"
                            placeholder="Enter New Name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            required
                            className="text-black w-full px-4 py-2 border rounded-lg focus:ring-black focus:border-black"
                            disabled={loadingUpdate}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition font-semibold"
                        disabled={loadingUpdate}
                    >
                        {loadingUpdate ? "Saving..." : "Save New Name"}
                    </button>
                </form>

                <button
                    onClick={() => router.push("/profile")}
                    className="mt-4 w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition font-semibold"
                    disabled={loadingUpdate}
                >
                    Back to Profile
                </button>
            </div>
        </div>
    );
}