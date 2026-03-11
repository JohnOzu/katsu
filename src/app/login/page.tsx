'use client';

import { signInWithGoogle } from '@/src/lib/auth-actions';
import { useUserStore } from '@/src/lib/stores/user-store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
	const user = useUserStore((state) => state.user);
	const hydrated = useUserStore((state) => state.hydrated);
	const router = useRouter();

	// If already logged in, redirect to dashboard
	useEffect(() => {
		if (hydrated && user) router.push('/dashboard');
	}, [user, hydrated, router]);

	useEffect(() => {
		if (hydrated && user) {
			const params = new URLSearchParams(window.location.search);
			const returnTo = params.get('returnTo');
			router.push(returnTo ? decodeURIComponent(returnTo) : '/dashboard');
		}
	}, [hydrated, user, router]);

	// Don't render the page if already logged in
	if (!hydrated) {
		return (
			<div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
				<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	if (user) return null;

	return (
		<div className="min-h-screen overflow-hidden bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
			{/* Decorative background blobs */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-20 right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
				<div className="absolute top-40 left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
				<div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
			</div>

			{/* Nav */}
			<nav className="relative z-10">
				<div className="max-w-7xl mx-auto px-6 py-6">
					<Link href="/" className="inline-flex items-center space-x-3">
						<div className="w-12 h-12 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
							<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v18M5 4c3-2 6 2 9 0s6 2 6 2v9s-3-2-6 0-6-2-9 0" />
							</svg>
						</div>
						<span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
							Katsu
						</span>
					</Link>
				</div>
			</nav>

			{/* Login Card */}
			<div className="relative z-10 flex-1 flex items-center justify-center px-6 pt-4">
				<div className="w-full max-w-md animate-fadeInUp">
					<div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-blue-500/10 border border-slate-100 p-10">

						{/* Header */}
						<div className="text-center mb-8">
							<div className="w-16 h-16 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/30">
								<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v18M5 4c3-2 6 2 9 0s6 2 6 2v9s-3-2-6 0-6-2-9 0" />
								</svg>
							</div>
							<h1 className="text-3xl font-black text-slate-900 mb-2">Welcome back</h1>
							<p className="text-slate-500">Sign in to access your class</p>
						</div>

						{/* Google Button */}
						<button
							className="cursor-pointer w-full flex items-center justify-center space-x-3 px-6 py-4 bg-white border-2 border-slate-200 rounded-2xl font-semibold text-slate-700 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 transition-all transform hover:-translate-y-0.5 group"
							onClick={() => signInWithGoogle()}
						>
							<svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
								<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
								<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
								<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
								<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
							</svg>
							<span className="group-hover:text-blue-600 transition-colors">Continue with Google</span>
						</button>

						{/* Divider */}
						<div className="flex items-center my-7">
							<div className="flex-1 h-px bg-slate-200" />
							<span className="px-4 text-xs text-slate-400 font-medium uppercase tracking-wider">Secure Sign-In</span>
							<div className="flex-1 h-px bg-slate-200" />
						</div>

						{/* Trust badges */}
						<div className="flex items-center justify-center space-x-6">
							<div className="flex items-center space-x-1.5">
								<svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
								</svg>
								<span className="text-xs text-slate-500 font-medium">100% Free</span>
							</div>
							<div className="flex items-center space-x-1.5">
								<svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
								</svg>
								<span className="text-xs text-slate-500 font-medium">No Password</span>
							</div>
							<div className="flex items-center space-x-1.5">
								<svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
								</svg>
								<span className="text-xs text-slate-500 font-medium">Secure</span>
							</div>
						</div>

						{/* Terms note */}
						<p className="text-center text-xs text-slate-400 mt-7 leading-relaxed">
							By continuing, you agree to Katsu's{' '}
							<a href="#" className="text-blue-500 hover:underline">Terms of Service</a>{' '}
							and{' '}
							<a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>.
						</p>
					</div>

					{/* Back link */}
					<div className="text-center mt-6">
						<Link href="/" className="text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors inline-flex items-center space-x-1">
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
							</svg>
							<span>Back to home</span>
						</Link>
					</div>
				</div>
			</div>

			{/* Footer */}
			<footer className="relative z-10 text-center pt-6 pb-2 my-auto text-sm text-slate-400">
				© 2026 Katsu. All rights reserved.
			</footer>
		</div>
	);
}