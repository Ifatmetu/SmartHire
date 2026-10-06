import React from "react";
import Link from "next/link";

const Navbar = () => {
    return (
        <nav className="w-full border-b border-gray-100 bg-white">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                        👥
                    </div>

                    <span className="text-sm font-bold text-blue-600">
                        SmartHire
                    </span>
                </Link>

                {/* Navigation Links */}
                <div className="hidden items-center gap-7 text-[10px] font-medium text-gray-500 md:flex">

                    <Link
                        href="/"
                        className="text-blue-600 hover:text-blue-700"
                    >
                        Home
                    </Link>

                    <Link
                        href="/jobs"
                        className="hover:text-blue-600"
                    >
                        Find Jobs
                    </Link>

                    <Link
                        href="/candidates"
                        className="hover:text-blue-600"
                    >
                        Find Candidates
                    </Link>

                    <Link
                        href="/employers"
                        className="hover:text-blue-600"
                    >
                        For Employers
                    </Link>

                    <Link
                        href="/about"
                        className="hover:text-blue-600"
                    >
                        About
                    </Link>

                </div>

                {/* Auth Buttons */}
                <div className="flex items-center gap-3">

                    <Link
                        href="/login"
                        className="text-[10px] font-medium text-gray-600 hover:text-blue-600"
                    >
                        Login
                    </Link>

                    <Link
                        href="/signup"
                        className="rounded-md bg-blue-600 px-4 py-1.5 text-[10px] font-medium text-white shadow-sm transition hover:bg-blue-700"
                    >
                        Sign Up
                    </Link>

                </div>

            </div>
        </nav>
    );
};

export default Navbar;