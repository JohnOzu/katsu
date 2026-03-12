'use client'

import Link from "next/link";
import Image from 'next/image';
import { signOut } from "@/src/lib/auth-actions";
import { useEffect, useRef, useState } from "react";
import { useUserStore } from "@/src/lib/stores/user-store";
import ThemeToggle from "./ThemeToggle";

export default function MainHeader() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const user = useUserStore((state) => state.user);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleSignOut = async () => signOut();

    return (
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800">
            <nav className="relative z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link className="flex items-center space-x-3" href="/">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v18M5 4c3-2 6 2 9 0s6 2 6 2v9s-3-2-6 0-6-2-9 0" />
                                </svg>
                            </div>
                            <span className="text-xl sm:text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Katsu
                            </span>
                        </Link>

                        {/* Desktop nav */}
                        <div className="hidden md:flex items-center space-x-6">
                            <Link href="#features" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                                Features
                            </Link>
                            <Link href="#how-it-works" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                                How It Works
                            </Link>
                            <ThemeToggle />

                            {user ? (
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                    >
                                        {user.user_metadata.avatar_url ? (
                                            <Image src={user.user_metadata.avatar_url} alt={user.user_metadata.name} width={32} height={32} className="rounded-full object-cover ring-2 ring-blue-500/30" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                                                {user.user_metadata.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <span className="text-slate-700 dark:text-slate-200 font-medium text-sm">{user.user_metadata.name}</span>
                                        <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {dropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50">
                                            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.user_metadata.name}</p>
                                                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                                            </div>
                                            <Link href="/dashboard" className="flex items-center space-x-2.5 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                                <span>Go to Dashboard</span>
                                            </Link>
                                            <button onClick={handleSignOut} className="w-full flex items-center space-x-2.5 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Link href="/login" className="px-5 py-2.5 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                                        Log In
                                    </Link>
                                    <Link href="/login" className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5">
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile right side */}
                        <div className="flex md:hidden items-center space-x-2">
                            <ThemeToggle />
                            {user && (
                                <Link href="/dashboard">
                                    {user.user_metadata.avatar_url ? (
                                        <Image src={user.user_metadata.avatar_url} alt={user.user_metadata.name} width={32} height={32} className="rounded-full object-cover ring-2 ring-blue-500/30" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                                            {user.user_metadata.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </Link>
                            )}
                            <button
                                onClick={() => setMobileMenuOpen(m => !m)}
                                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                            >
                                {mobileMenuOpen ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden mt-4 pb-2 border-t border-slate-100 dark:border-slate-800 pt-4 space-y-1">
                            <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-sm transition-colors">
                                Features
                            </Link>
                            <Link href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-sm transition-colors">
                                How It Works
                            </Link>
                            {user ? (
                                <>
                                    <div className="px-3 py-2.5 border-t border-slate-100 dark:border-slate-800 mt-2 pt-4">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.user_metadata.name}</p>
                                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                                    </div>
                                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 text-sm font-medium transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                        <span>Go to Dashboard</span>
                                    </Link>
                                    <button onClick={handleSignOut} className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium transition-colors cursor-pointer">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                        <span>Sign Out</span>
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
                                    <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 text-center text-slate-600 dark:text-slate-300 hover:text-blue-600 font-medium text-sm transition-colors">
                                        Log In
                                    </Link>
                                    <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 text-center bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all">
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}