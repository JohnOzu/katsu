'use client';

import Link from 'next/link';
import { useUserStore } from '../lib/stores/user-store';

export default function NotFound() {
	const user = useUserStore((state) => state.user);
	const hydrated = useUserStore((state) => state.hydrated);

	return (
		<div className="h-screen overflow-hidden bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col items-center justify-center relative">
			{/* Decorative background blobs */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-20 right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
				<div className="absolute top-40 left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
				<div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
			</div>

			<div className="relative z-10 text-center px-6 animate-fadeInUp">
				{/* Logo */}
				<Link href="/" className="inline-flex items-center space-x-3 mb-12">
					<div className="w-12 h-12 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
						<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v18M5 4c3-2 6 2 9 0s6 2 6 2v9s-3-2-6 0-6-2-9 0" />
						</svg>
					</div>
					<span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
						Katsu
					</span>
				</Link>

				{/* 404 */}
				<div className="mb-6">
					<h1 className="text-[10rem] font-black leading-none bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
						404
					</h1>
				</div>

				<h2 className="text-3xl font-black text-slate-900 mb-4">
					Page not found
				</h2>
				<p className="text-slate-500 text-lg max-w-md mx-auto mb-10">
					Looks like this page took the day off. Let's get you back on track.
				</p>

				<div className="flex items-center justify-center space-x-4">
					<Link
						href="/"
						className="group px-8 py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 inline-flex items-center space-x-2"
					>
						<svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
						</svg>
						<span>Back to Home</span>
					</Link>
					{hydrated && user && (
						<Link
							href="/dashboard"
							className="px-8 py-3.5 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:border-blue-400 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
						>
							Go to Dashboard
						</Link>
					)}
				</div>
			</div>
		</div>
	);
}