'use client';

import { useState } from 'react';
import Link from 'next/link';

const categories = [
	{ label: 'General', emoji: '💬', faqs: [{ q: 'What is Katsu?', a: 'Katsu is a collaborative task management platform built specifically for academic classes. It lets students and class admins create shared task lists, track deadlines by subject, and stay synchronized — all in one place.' }, { q: 'Is Katsu free?', a: 'Yes, completely. Katsu is free forever for students. There are no hidden fees, no premium tiers, and no credit card required to sign up.' }, { q: 'Who is Katsu built for?', a: 'Katsu is built for student groups — typically a section or class in a school or university. It works best when one person (the admin) sets up the class and invites their classmates.' }, { q: 'Do I need to install anything?', a: "No. Katsu is fully web-based. Just open it in your browser, sign in with Google, and you're ready to go." }] },
	{ label: 'Account & Access', emoji: '🔐', faqs: [{ q: 'How do I sign in?', a: 'Katsu uses Google Sign-In only. Click "Continue with Google" on the login page and authorize with your Google account. No separate password needed.' }, { q: 'Can I use Katsu without a Google account?', a: "Currently, Google OAuth is the only sign-in method we support. This lets us keep authentication secure without storing passwords ourselves." }, { q: 'How do I delete my account?', a: "You can request account deletion by contacting us at hello@katsu.app. We'll remove your personal data within 30 days." }, { q: 'Can I be in multiple classes at once?', a: "Yes. You can join as many classes as you're invited to. Switch between them from the dashboard sidebar." }] },
	{ label: 'Classes & Members', emoji: '🏫', faqs: [{ q: 'How do I create a class?', a: "From your dashboard, click \"New Class\", fill in the class name and description, and you're set. You'll automatically become the admin." }, { q: 'How do I invite classmates?', a: "As an admin, go to the Members tab of your class and generate an invite link. Share that link with your classmates — they just need to open it while signed in." }, { q: 'Can I have multiple admins?', a: "Yes. Admins can promote other members to admin from the Members tab. Admins can manage tasks, subjects, members, and class settings." }, { q: 'How do I remove a member from a class?', a: "Admins can remove any member from the Members tab. The removed member will lose access to the class immediately." }, { q: 'Can I leave a class?', a: "Yes. You can leave any class you're a member of from the class settings. If you're the last admin, you'll need to promote someone else first." }] },
	{ label: 'Tasks & Subjects', emoji: '📋', faqs: [{ q: 'Who can create tasks?', a: "Currently, only admins can create, edit, and delete tasks. Members can mark tasks as complete for themselves." }, { q: 'What are subjects?', a: "Subjects let you group tasks by course — like Math, English, or Computer Science. Admins can create and manage subjects from the Subjects tab." }, { q: 'Can I filter tasks?', a: "Yes. The Tasks tab has filters for completion status, subject, and deadline range, plus sorting options so you can focus on what matters most." }, { q: 'Does marking a task complete affect other members?', a: "No. Task completion is tracked per person. When you mark a task done, it only updates your own completion status — not your classmates'." }, { q: 'Can I set a deadline for a task?', a: "Yes. When creating or editing a task, admins can set an optional deadline date and time. Deadlines are visible to all class members." }] },
	{ label: 'Technical', emoji: '⚙️', faqs: [{ q: 'What technology does Katsu use?', a: "Katsu is built with Next.js (App Router) on the frontend and Supabase for authentication and the database. Data is synced in real time using Supabase subscriptions." }, { q: 'Is my data backed up?', a: "Yes. Supabase provides automated daily backups. Your class data is stored securely and is not at risk from accidental loss." }, { q: 'Does Katsu work on mobile?', a: "Katsu is responsive and works on mobile browsers. A dedicated mobile app is not available yet, but it's on our roadmap." }, { q: 'I found a bug. How do I report it?', a: "We appreciate bug reports! Please use the Contact page or email us directly at hello@katsu.app with steps to reproduce the issue. We typically respond within 24 hours." }] },
];

function FAQItem({ q, a }: { q: string; a: string }) {
	const [open, setOpen] = useState(false);
	return (
		<div className="border-b border-slate-100 dark:border-slate-700 last:border-0">
			<button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 text-left gap-4 group cursor-pointer">
				<span className={`font-semibold text-sm leading-snug transition-colors ${open ? 'text-blue-600' : 'text-slate-800 dark:text-slate-200 group-hover:text-blue-600'}`}>{q}</span>
				<span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${open ? 'bg-blue-600 text-white rotate-45' : 'bg-slate-100 dark:bg-slate-700 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
					<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
				</span>
			</button>
			{open && <p className="pb-4 text-slate-500 dark:text-slate-400 text-sm leading-relaxed pr-10">{a}</p>}
		</div>
	);
}

export default function FAQPage() {
	const [activeCategory, setActiveCategory] = useState(categories[0].label);
	const active = categories.find((c) => c.label === activeCategory)!;

	return (
		<div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
			<div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
				<div className="text-center mb-10 sm:mb-14">
					<div className="inline-block mb-4 px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">FAQ</div>
					<h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
						Frequently Asked{' '}
						<span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Questions</span>
					</h1>
					<p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
						Everything you need to know about Katsu. Can't find what you're looking for?{' '}
						<Link href="/contact" className="text-blue-600 font-medium hover:underline">Reach out to us.</Link>
					</p>
				</div>

				<div className="flex flex-col md:flex-row gap-6 sm:gap-8">
					<div className="md:w-56 shrink-0">
						<div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow p-3 flex flex-row md:flex-col gap-1 overflow-x-auto">
							{categories.map((cat) => (
								<button key={cat.label} onClick={() => setActiveCategory(cat.label)} className={`flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer w-full text-left ${activeCategory === cat.label ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400'}`}>
									<span>{cat.emoji}</span>
									<span className="hidden sm:inline">{cat.label}</span>
								</button>
							))}
						</div>
					</div>

					<div className="flex-1">
						<div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow px-5 sm:px-7 py-2">
							<div className="flex items-center space-x-2 py-4 mb-1 border-b border-slate-100 dark:border-slate-700">
								<span className="text-2xl">{active.emoji}</span>
								<h2 className="text-lg font-black text-slate-900 dark:text-white">{active.label}</h2>
								<span className="ml-auto text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-full">{active.faqs.length} questions</span>
							</div>
							{active.faqs.map((faq) => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
						</div>
					</div>
				</div>

				<div className="mt-8 sm:mt-10 bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-10 text-white text-center">
					<div className="text-4xl mb-3">🤔</div>
					<h2 className="text-2xl font-black mb-2">Still have questions?</h2>
					<p className="text-blue-100 mb-6 max-w-md mx-auto text-sm leading-relaxed">We're a small team and we actually read every message. Drop us a note and we'll get back to you within 24 hours.</p>
					<Link href="/contact" className="inline-block px-8 py-3 bg-white text-blue-600 rounded-xl font-bold hover:shadow-xl transition-all transform hover:-translate-y-0.5">Contact Us →</Link>
				</div>
			</div>
		</div>
	);
}