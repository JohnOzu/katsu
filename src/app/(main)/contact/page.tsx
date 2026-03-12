'use client';

import { useState } from 'react';

export default function ContactPage() {
	const [submitted, setSubmitted] = useState(false);
	const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

	const handleSubmit = () => {
		if (!form.name || !form.email || !form.message) return;
		setSubmitted(true);
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
			<div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
				<div className="text-center mb-10 sm:mb-14">
					<div className="inline-block mb-4 px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">Get in Touch</div>
					<h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4">
						We'd Love to{' '}
						<span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Hear from You</span>
					</h1>
					<p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">Questions, feedback, bug reports — drop us a message.</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-5 gap-6 sm:gap-8">
					<div className="md:col-span-2 space-y-4 sm:space-y-5">
						{[
							{
								icon: <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
								label: 'Email', value: 'hello@katsu.app',
							},
							{
								icon: <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
								label: 'Response Time', value: 'Usually within 24 hours',
							},
							{
								icon: <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
								label: 'Based in', value: 'Philippines 🇵🇭',
							},
						].map((item) => (
							<div key={item.label} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow p-4 sm:p-5 flex items-start space-x-4">
								<div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/50 rounded-xl flex items-center justify-center shrink-0">{item.icon}</div>
								<div>
									<p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wide mb-0.5">{item.label}</p>
									<p className="text-slate-800 dark:text-slate-200 font-semibold text-sm">{item.value}</p>
								</div>
							</div>
						))}

						<div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 sm:p-6 text-white">
							<h3 className="font-bold text-lg mb-2">Found a bug?</h3>
							<p className="text-blue-100 text-sm leading-relaxed">
								We take bugs seriously. Please include steps to reproduce and we'll get it fixed fast.
							</p>
						</div>
					</div>

					<div className="md:col-span-3 bg-white dark:bg-slate-800 rounded-3xl shadow border border-slate-100 dark:border-slate-700 p-6 sm:p-8">
						{submitted ? (
							<div className="h-full flex flex-col items-center justify-center text-center py-10">
								<div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mb-4">
									<svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
									</svg>
								</div>
								<h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Message Sent!</h3>
								<p className="text-slate-500 dark:text-slate-400 mb-6">Thanks for reaching out. We'll get back to you shortly.</p>
								<button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all">
									Send Another
								</button>
							</div>
						) : (
							<div className="space-y-5">
								<h2 className="text-2xl font-black text-slate-900 dark:text-white">Send a Message</h2>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Name</label>
										<input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all" />
									</div>
									<div>
										<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
										<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all" />
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Subject</label>
									<input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="What's this about?" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all" />
								</div>
								<div>
									<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Message</label>
									<textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us what's on your mind..." rows={5} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all resize-none" />
								</div>
								<button onClick={handleSubmit} className="w-full py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5">
									Send Message
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}