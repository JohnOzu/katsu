'use client';

import { useUserStore } from '@lib/stores/user-store';
import Link from 'next/link';

export default function HomePage() {
	const user = useUserStore((state) => state.user);

	return (
		<div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-20 right-20 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
				<div className="absolute top-40 left-20 w-96 h-96 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
				<div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-200 dark:bg-pink-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
			</div>

			{/* Hero */}
			<section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 pb-20 sm:pb-32">
				<div className="text-center animate-fadeInUp">
					<div className="inline-block mb-6 px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
						📚 Made for Students, Built for Success
					</div>

					<h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
						Keep Your Class
						<br />
						<span className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
							Organized & On Track
						</span>
					</h1>

					<p className="text-base sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed px-2">
						A collaborative task management system designed for academic classes.
						Track assignments, manage deadlines, and stay synchronized with your entire class.
					</p>

					<div className="flex items-center justify-center">
						{user ? (
							<Link href="/dashboard" className="cursor-pointer group px-7 py-3.5 sm:px-8 sm:py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-base sm:text-lg hover:shadow-2xl hover:shadow-blue-500/40 transition-all transform hover:-translate-y-1 inline-flex items-center">
								Go to Dashboard
								<svg className="inline-block w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
								</svg>
							</Link>
						) : (
							<Link href="/login" className="cursor-pointer group px-7 py-3.5 sm:px-8 sm:py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-base sm:text-lg hover:shadow-2xl hover:shadow-blue-500/40 transition-all transform hover:-translate-y-1 inline-flex items-center">
								Start Your Class
								<svg className="inline-block w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
								</svg>
							</Link>
						)}
					</div>

					{/* Trust Indicators */}
					<div className="mt-12 sm:mt-16">
						<div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-6 sm:px-8 py-4 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
							<div className="flex items-center space-x-2">
								<svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
								</svg>
								<span className="text-slate-700 dark:text-slate-300 font-medium">100% Free</span>
							</div>
							<div className="flex items-center space-x-2">
								<svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
								</svg>
								<span className="text-slate-700 dark:text-slate-300 font-medium">No Credit Card</span>
							</div>
							<div className="flex items-center space-x-2">
								<svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
								</svg>
								<span className="text-slate-700 dark:text-slate-300 font-medium">Unlimited Classes</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features */}
			<section id="features" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20">
				<div className="text-center mb-12 sm:mb-16">
					<h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4">Everything for Tracking Needs</h2>
					<p className="text-base sm:text-xl text-slate-600 dark:text-slate-400">Purpose-built features for academic collaboration and task tracking</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
					{[
						{ gradient: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-500/30', title: 'Class Groups', desc: 'Organize students by class year and program. Every member sees shared tasks and deadlines in real-time.', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /> },
						{ gradient: 'from-indigo-500 to-indigo-600', shadow: 'shadow-indigo-500/30', title: 'Subject Tracking', desc: 'Separate tasks by subject. See all Computer Science, Math, and English assignments at a glance.', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> },
						{ gradient: 'from-purple-500 to-purple-600', shadow: 'shadow-purple-500/30', title: 'Smart Reminders', desc: 'Never miss a deadline. Get notifications for upcoming tasks and keep your entire class on schedule.', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /> },
						{ gradient: 'from-pink-500 to-pink-600', shadow: 'shadow-pink-500/30', title: 'Progress Insights', desc: 'Track individual and class-wide progress. See completion rates and stay motivated together.', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> },
						{ gradient: 'from-green-500 to-green-600', shadow: 'shadow-green-500/30', title: 'Calendar View', desc: 'Visualize all deadlines in a unified calendar. Plan your study schedule effectively.', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
						{ gradient: 'from-orange-500 to-orange-600', shadow: 'shadow-orange-500/30', title: 'Secure & Private', desc: 'Class data stays within your group. Secure authentication and role-based access control.', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /> },
					].map((feature) => (
						<div key={feature.title} className="group p-6 sm:p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-slate-100 dark:border-slate-700">
							<div className={`w-14 h-14 bg-linear-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg ${feature.shadow}`}>
								<svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">{feature.icon}</svg>
							</div>
							<h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
							<p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
						</div>
					))}
				</div>
			</section>

			{/* How It Works */}
			<section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20">
				<div className="text-center mb-12 sm:mb-16">
					<h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4">Get Started in Minutes</h2>
					<p className="text-base sm:text-xl text-slate-600 dark:text-slate-400">Simple setup, powerful results</p>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
					{[
						{ num: '1', gradient: 'from-blue-100 to-blue-200', textColor: 'text-blue-600', title: 'Create Class', desc: 'Set up your class group with year and program' },
						{ num: '2', gradient: 'from-indigo-100 to-indigo-200', textColor: 'text-indigo-600', title: 'Invite Students', desc: 'Share invite link with classmates' },
						{ num: '3', gradient: 'from-purple-100 to-purple-200', textColor: 'text-purple-600', title: 'Add Tasks', desc: 'Create tasks organized by subject' },
						{ num: '4', gradient: 'from-pink-100 to-pink-200', textColor: 'text-pink-600', title: 'Track Progress', desc: 'Everyone stays synchronized and informed' },
					].map((step) => (
						<div key={step.num} className="text-center">
							<div className={`w-14 h-14 sm:w-16 sm:h-16 bg-linear-to-br ${step.gradient} dark:bg-none dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-xl sm:text-2xl font-black ${step.textColor}`}>{step.num}</div>
							<h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
							<p className="text-sm text-slate-600 dark:text-slate-400">{step.desc}</p>
						</div>
					))}
				</div>
			</section>

			{/* CTA */}
			<section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-20 mb-10">
				<div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-center shadow-2xl shadow-blue-500/30">
					<h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">Ready to Organize Your Class?</h2>
					<p className="text-base sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
						Stop missing deadlines. Start owning your semester.
					</p>
					{user ? (
						<Link href="/dashboard" className="cursor-pointer inline-block px-8 sm:px-10 py-4 bg-white text-blue-600 rounded-2xl font-bold text-base sm:text-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
							Go to Your Dashboard
						</Link>
					) : (
						<Link href="/login" className="cursor-pointer inline-block px-8 sm:px-10 py-4 bg-white text-blue-600 rounded-2xl font-bold text-base sm:text-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
							Create Your Class Today
						</Link>
					)}
					<p className="text-blue-200 mt-4 text-sm">No credit card required • Free forever for students</p>
				</div>
			</section>
		</div>
	);
}