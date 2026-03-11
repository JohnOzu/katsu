'use client';

import Link from 'next/link';

const sections = [
	{ title: 'Acceptance of Terms', content: `By accessing or using Katsu, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use the service. These terms apply to all users, including class administrators and members.` },
	{ title: 'Eligibility', content: `Katsu is intended for use by students and academic groups. You must be at least 13 years old to use this service. By using Katsu, you confirm that you meet this requirement. If you are under 18, you should review these terms with a parent or guardian.` },
	{ title: 'Your Account', content: `You are responsible for maintaining the security of your account. Katsu uses Google OAuth for authentication — we never store your password. You are responsible for any activity that occurs under your account. If you notice unauthorized access, contact us immediately at hello@katsu.app.` },
	{ title: 'Acceptable Use', content: `You agree not to use Katsu to harass, bully, or harm other users. You may not use the platform to share illegal content, impersonate others, or attempt to gain unauthorized access to other users' data. Violations may result in immediate account termination.` },
	{ title: 'Class Data & Content', content: `Content you create — classes, tasks, subjects — remains yours. By submitting content to Katsu, you grant us a limited license to store and display it for the purpose of providing the service. We do not claim ownership of your content.` },
	{ title: 'Service Availability', content: `We aim to keep Katsu available at all times, but we do not guarantee uninterrupted access. We may perform maintenance, updates, or experience outages. We are not liable for any loss resulting from temporary unavailability of the service.` },
	{ title: 'Termination', content: `You may stop using Katsu at any time by deleting your account. We reserve the right to suspend or terminate your account if you violate these terms. Upon termination, your access to classes and tasks will be revoked.` },
	{ title: 'Limitation of Liability', content: `Katsu is provided "as is" without warranties of any kind. To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from your use of the service.` },
	{ title: 'Changes to Terms', content: `We may update these terms from time to time. We will notify users of significant changes via email or an in-app notice. Continued use of Katsu after updates constitutes acceptance of the revised terms.` },
];

export default function TermsPage() {
	return (
		<div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
			<div className="relative z-10 max-w-3xl mx-auto px-6 py-16">
				<div className="mb-12">
					<div className="inline-block mb-4 px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">Legal</div>
					<h1 className="text-5xl font-black text-slate-900 dark:text-white mb-4">Terms of Service</h1>
					<p className="text-slate-500 dark:text-slate-400 text-sm">Last updated: March 1, 2026</p>
					<p className="text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
						These are the rules for using Katsu. We've written them in plain language. Please read them — they protect both you and us.
					</p>
				</div>

				<div className="space-y-6">
					{sections.map((section, i) => (
						<div key={section.title} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow p-7">
							<div className="flex items-start space-x-4">
								<div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
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
					<h3 className="text-xl font-black mb-2">Have questions about these terms?</h3>
					<p className="text-blue-100 text-sm mb-4">We're real humans — reach out and we'll explain anything.</p>
					<Link href="/contact" className="inline-block px-6 py-2.5 bg-white text-blue-600 rounded-xl font-semibold text-sm hover:shadow-lg transition-all transform hover:-translate-y-0.5">
						Contact Us
					</Link>
				</div>
			</div>
		</div>
	);
}