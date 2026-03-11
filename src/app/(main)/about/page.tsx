'use client';

import Link from 'next/link';

export default function AboutPage() {
	return (
		<div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
			<div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
				<div className="text-center mb-16">
					<div className="inline-block mb-4 px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">Our Story</div>
					<h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
						Built by Students,
						<br />
						<span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">for Students</span>
					</h1>
					<p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
						Katsu was born out of frustration — missed deadlines, scattered group chats, and the chaos of tracking assignments across a whole class. We built the tool we wished we had.
					</p>
				</div>

				<div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 p-10 mb-8">
					<h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Our Mission</h2>
					<p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg mb-4">
						We believe that academic success isn't just an individual effort — it's a collective one. When a class is organized, everyone benefits. No one gets left behind on a deadline they didn't know about.
					</p>
					<p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
						Katsu is designed to make class-wide coordination effortless. One platform, every assignment, every person — synchronized in real time.
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-6 mb-8">
					{[
						{ emoji: '🎯', title: 'Focus', desc: 'We build only what students actually need. No bloat, no distractions.' },
						{ emoji: '🤝', title: 'Collaboration', desc: 'The best academic outcomes happen when classmates work together.' },
						{ emoji: '🔓', title: 'Openness', desc: 'Free forever for students. Education tools should never be paywalled.' },
					].map((v) => (
						<div key={v.title} className="bg-white dark:bg-slate-800 rounded-2xl shadow border border-slate-100 dark:border-slate-700 p-6 text-center">
							<div className="text-4xl mb-3">{v.emoji}</div>
							<h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{v.title}</h3>
							<p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{v.desc}</p>
						</div>
					))}
				</div>

				<div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-center text-white">
					<h2 className="text-3xl font-black mb-4">A Small Team with Big Ambitions</h2>
					<p className="text-blue-100 text-lg leading-relaxed max-w-2xl mx-auto mb-6">
						We're a small group of CS students who got tired of using spreadsheets to track class tasks. Katsu is our answer — and we're just getting started.
					</p>
					<Link href="/contact" className="inline-block px-8 py-3 bg-white text-blue-600 rounded-xl font-bold hover:shadow-xl transition-all transform hover:-translate-y-0.5">
						Say Hello →
					</Link>
				</div>
			</div>
		</div>
	);
}