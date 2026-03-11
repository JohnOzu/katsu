'use client';

import Link from 'next/link';

const sections = [
	{ title: 'Information We Collect', content: `When you sign in to Katsu using Google OAuth, we receive your name, email address, and profile picture from Google. We do not store your Google password. We also collect the data you create within the app — classes, tasks, subjects, and membership records — which is stored securely in our database.` },
	{ title: 'How We Use Your Information', content: `Your information is used solely to provide the Katsu service. This includes displaying your profile within class groups you belong to, enabling you to create and manage tasks, and allowing other class members to identify you. We do not use your data for advertising, and we do not sell it to third parties.` },
	{ title: 'Data Sharing', content: `Within a class group, your name and profile picture are visible to other members of that class. Your email address is only visible to class administrators. We do not share your data with anyone outside of Katsu unless required by law.` },
	{ title: 'Data Retention', content: `Your account data is retained as long as your account is active. If you delete your account, your personal data will be removed within 30 days. Class data you contributed (tasks, subjects) may remain in the class unless the class itself is deleted by an administrator.` },
	{ title: 'Cookies & Local Storage', content: `Katsu uses browser cookies to maintain your authenticated session. We do not use tracking cookies or analytics cookies from third parties. Session cookies expire when you sign out or after a period of inactivity.` },
	{ title: 'Security', content: `We use Supabase for authentication and data storage, which encrypts data in transit and at rest. Access to your data is controlled by row-level security policies — you can only access classes and tasks you are a member of.` },
	{ title: 'Your Rights', content: `You have the right to access, correct, or delete your personal data at any time. To request data deletion or export, contact us at hello@katsu.app. We will respond within 7 business days.` },
	{ title: 'Changes to This Policy', content: `We may update this Privacy Policy from time to time. If we make significant changes, we will notify users via email or a notice within the app. Continued use of Katsu after changes constitutes acceptance of the updated policy.` },
];

export default function PrivacyPage() {
	return (
		<div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
			<div className="relative z-10 max-w-3xl mx-auto px-6 py-16">
				<div className="mb-12">
					<div className="inline-block mb-4 px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">Legal</div>
					<h1 className="text-5xl font-black text-slate-900 dark:text-white mb-4">Privacy Policy</h1>
					<p className="text-slate-500 dark:text-slate-400 text-sm">Last updated: March 1, 2026</p>
					<p className="text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
						Your privacy matters to us. This policy explains what data we collect, why we collect it, and how we protect it. We've kept it short and plain — no legal maze.
					</p>
				</div>

				<div className="space-y-6">
					{sections.map((section, i) => (
						<div key={section.title} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow p-7">
							<div className="flex items-start space-x-4">
								<div className="w-8 h-8 bg-linear-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
									{i + 1}
								</div>
								<div>
									<h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{section.title}</h2>
									<p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{section.content}</p>
								</div>
							</div>
						</div>
					))}
				</div>

				<div className="mt-10 bg-linear-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white text-center">
					<h3 className="text-xl font-black mb-2">Questions about your privacy?</h3>
					<p className="text-blue-100 text-sm mb-4">We are happy to help clarify anything in this policy.</p>
					<Link href="/contact" className="inline-block px-6 py-2.5 bg-white text-blue-600 rounded-xl font-semibold text-sm hover:shadow-lg transition-all transform hover:-translate-y-0.5">
						Contact Us
					</Link>
				</div>
			</div>
		</div>
	);
}