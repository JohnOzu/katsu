'use client';

import Link from 'next/link';

const practices = [
	{
		icon: (<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>),
		color: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-500/30',
		title: 'Google OAuth Only',
		desc: 'We never store passwords. Authentication is handled entirely by Google, which means we rely on their world-class security infrastructure for login.',
	},
	{
		icon: (<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>),
		color: 'from-indigo-500 to-indigo-600', shadow: 'shadow-indigo-500/30',
		title: 'Row-Level Security',
		desc: "Supabase RLS policies ensure you can only access data from classes you're a member of. Even direct database queries are blocked at the database level.",
	},
	{
		icon: (<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>),
		color: 'from-purple-500 to-purple-600', shadow: 'shadow-purple-500/30',
		title: 'Encrypted in Transit & at Rest',
		desc: 'All data is transmitted over HTTPS/TLS. Data stored in our Supabase database is encrypted at rest using AES-256 encryption.',
	},
	{
		icon: (<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>),
		color: 'from-pink-500 to-pink-600', shadow: 'shadow-pink-500/30',
		title: 'Role-Based Access Control',
		desc: 'Class admins can manage members and settings. Regular members can only see and interact with content in their own class. Role changes take effect instantly.',
	},
	{
		icon: (<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>),
		color: 'from-green-500 to-green-600', shadow: 'shadow-green-500/30',
		title: 'Secure Invite Codes',
		desc: 'Class invite links are one-time use per slot and can be revoked by admins at any time. This prevents unauthorized users from joining private classes.',
	},
	{
		icon: (<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>),
		color: 'from-orange-500 to-orange-600', shadow: 'shadow-orange-500/30',
		title: 'Session Management',
		desc: 'Sessions expire automatically after inactivity. Signing out invalidates your session token immediately across all devices.',
	},
];

export default function SecurityPage() {
	return (
		<div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
			<div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
				<div className="text-center mb-16">
					<div className="inline-block mb-4 px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">Security</div>
					<h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
						Your Data is{' '}
						<span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Safe with Us</span>
					</h1>
					<p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
						We've built Katsu with security at the foundation — not bolted on as an afterthought. Here's exactly how we protect you.
					</p>
				</div>

				<div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow p-6 mb-10 flex flex-wrap items-center justify-center gap-8">
					{[
						{ label: 'Encrypted in Transit', icon: '🔒' },
						{ label: 'No Password Storage', icon: '🚫' },
						{ label: 'RLS Protected DB', icon: '🛡️' },
						{ label: 'HTTPS Only', icon: '✅' },
					].map((item) => (
						<div key={item.label} className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-semibold text-sm">
							<span className="text-xl">{item.icon}</span>
							<span>{item.label}</span>
						</div>
					))}
				</div>

				<div className="grid md:grid-cols-2 gap-6 mb-10">
					{practices.map((p) => (
						<div key={p.title} className="group bg-white dark:bg-slate-800 rounded-2xl shadow border border-slate-100 dark:border-slate-700 p-7 hover:shadow-xl hover:-translate-y-1 transition-all">
							<div className="flex items-start space-x-4">
								<div className={`w-12 h-12 bg-linear-to-br ${p.color} rounded-xl flex items-center justify-center shrink-0 shadow-lg ${p.shadow} group-hover:scale-110 transition-transform`}>
									{p.icon}
								</div>
								<div>
									<h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">{p.title}</h3>
									<p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{p.desc}</p>
								</div>
							</div>
						</div>
					))}
				</div>

				<div className="bg-linear-to-br from-slate-800 to-slate-900 rounded-3xl p-10 text-white">
					<div className="flex flex-col md:flex-row items-center justify-between gap-6">
						<div>
							<h2 className="text-2xl font-black mb-2">Found a Security Issue?</h2>
							<p className="text-slate-300 leading-relaxed max-w-xl">
								We take vulnerability reports seriously. If you've discovered a security issue in Katsu, please disclose it responsibly. We'll investigate and respond within 48 hours.
							</p>
						</div>
						<Link href="/contact" className="shrink-0 px-7 py-3 bg-linear-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-blue-500/40 transition-all transform hover:-translate-y-0.5 whitespace-nowrap">
							Report a Vulnerability
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}