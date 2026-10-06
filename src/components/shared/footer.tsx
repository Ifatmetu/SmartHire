import React from 'react';
import Link from "next/link";
const Footer = () => {
    return (
        <div>
            <footer className="border-t border-gray-200 bg-white">
                <div className="mx-auto max-w-7xl px-6 py-10">

                    {/* Main Footer */}
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">

                        {/* Brand */}
                        <div>
                            <Link href="/" className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                                    👥
                                </div>

                                <span className="text-base font-bold text-blue-600">
                                    SmartHire
                                </span>
                            </Link>

                            <p className="mt-3 max-w-xs text-xs leading-5 text-gray-500">
                                Smarter hiring for better opportunities.
                                Connect the right people with the right jobs.
                            </p>
                        </div>

                        {/* For Job Seekers */}
                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-gray-800">
                                For Job Seekers
                            </h3>

                            <div className="flex flex-col gap-2 text-xs text-gray-500">
                                <Link
                                    href="/jobs"
                                    className="hover:text-blue-600"
                                >
                                    Find Jobs
                                </Link>

                                <Link
                                    href="/profile"
                                    className="hover:text-blue-600"
                                >
                                    My Profile
                                </Link>

                                <Link
                                    href="/applications"
                                    className="hover:text-blue-600"
                                >
                                    My Applications
                                </Link>

                                <Link
                                    href="/recommendations"
                                    className="hover:text-blue-600"
                                >
                                    Job Recommendations
                                </Link>
                            </div>
                        </div>

                        {/* For Employers */}
                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-gray-800">
                                For Employers
                            </h3>

                            <div className="flex flex-col gap-2 text-xs text-gray-500">
                                <Link
                                    href="/employers"
                                    className="hover:text-blue-600"
                                >
                                    Find Candidates
                                </Link>

                                <Link
                                    href="/post-job"
                                    className="hover:text-blue-600"
                                >
                                    Post a Job
                                </Link>

                                <Link
                                    href="/applicants"
                                    className="hover:text-blue-600"
                                >
                                    Manage Applicants
                                </Link>

                                <Link
                                    href="/pricing"
                                    className="hover:text-blue-600"
                                >
                                    Pricing
                                </Link>
                            </div>
                        </div>

                        {/* Company */}
                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-gray-800">
                                Company
                            </h3>

                            <div className="flex flex-col gap-2 text-xs text-gray-500">
                                <Link
                                    href="/about"
                                    className="hover:text-blue-600"
                                >
                                    About Us
                                </Link>

                                <Link
                                    href="/contact"
                                    className="hover:text-blue-600"
                                >
                                    Contact
                                </Link>

                                <Link
                                    href="/privacy"
                                    className="hover:text-blue-600"
                                >
                                    Privacy Policy
                                </Link>

                                <Link
                                    href="/terms"
                                    className="hover:text-blue-600"
                                >
                                    Terms & Conditions
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="mt-8 flex flex-col gap-3 border-t border-gray-100 pt-5 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">

                        <p>
                            © 2026 SmartHire. All rights reserved.
                        </p>

                        <div className="flex gap-5">
                            <Link
                                href="#"
                                className="hover:text-blue-600"
                            >
                                Facebook
                            </Link>

                            <Link
                                href="#"
                                className="hover:text-blue-600"
                            >
                                LinkedIn
                            </Link>

                            <Link
                                href="#"
                                className="hover:text-blue-600"
                            >
                                GitHub
                            </Link>
                        </div>

                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;