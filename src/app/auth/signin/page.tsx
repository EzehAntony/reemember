"use client";

import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";

export default function SignInPage () {
    return (
        <div className="h-screen flex items-center justify-center bg-base-300 p-4">
            <div className="bg-base-200 text-base-content shadow-lg rounded-xl p-8 w-full max-w-sm text-center space-y-6">
                {/* Title */ }
                <h1 className="text-2xl md:text-4xl font-semibold">
                    Reemember
                </h1>

                <p className="text-sm text-base-content/70">
                    Sign in to continue to your dashboard
                </p>

                {/* Sign in button */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => signIn("google", { callbackUrl: "/home" })}
                        className="btn btn-block btn-outline gap-4 normal-case"
                    >
                        <FaGoogle className="text-xl" />
                        <span>Sign in with Google</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
