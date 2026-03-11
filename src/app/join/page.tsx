'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@lib/supabase';
import { useUserStore } from '@lib/stores/user-store';
import { toast } from 'sonner';

export default function JoinPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const user = useUserStore((state) => state.user);
	const hydrated = useUserStore((state) => state.hydrated);

	const codeFromUrl = searchParams.get('code')?.toUpperCase() ?? '';

	const [step, setStep] = useState<'code' | 'password'>(codeFromUrl ? 'password' : 'code');
	const [code, setCode] = useState(codeFromUrl);
	const [password, setPassword] = useState('');
	const [classPreview, setClassPreview] = useState<{ name: string; id: string; inviteId: string } | null>(null);
	const [loading, setLoading] = useState(false);
	const [lookingUp, setLookingUp] = useState(false);

	const supabase = createClient();

	// ── Lookup ─────────────────────────────────────────────────────────────────

	async function lookupCode(lookupValue?: string) {
		const val = (lookupValue ?? code).trim().toUpperCase();
		if (!val) return toast.error('Enter a class code');
		setLookingUp(true);

		const { data, error } = await supabase
			.from('class_invites')
			.select('id, class_id, classes(name)')
			.eq('code', val)
			.maybeSingle();

		setLookingUp(false);

		if (error || !data) return toast.error('Invalid code — double check and try again');

		// Already a member?
		const { data: existing } = await supabase
			.from('class_members')
			.select('user_id')
			.eq('class_id', data.class_id)
			.eq('user_id', user!.id)
			.single();

		if (existing) {
			toast.error("You're already a member of this class");
			router.push('/dashboard');
			return;
		}

		setClassPreview({ name: (data as any).classes.name, id: data.class_id, inviteId: data.id });
		setStep('password');
	}

	// ── Join ───────────────────────────────────────────────────────────────────

	async function joinClass() {
		if (!password.trim()) return toast.error('Enter the class password');
		if (!classPreview) return;
		setLoading(true);

		const { data: invite, error } = await supabase
			.from('class_invites')
			.select('password')
			.eq('id', classPreview.inviteId)
			.single();

		if (error || !invite) { setLoading(false); return toast.error('Something went wrong'); }
		if (invite.password !== password.trim()) { setLoading(false); return toast.error('Wrong password'); }

		const { error: joinError } = await supabase
			.from('class_members')
			.insert({ class_id: classPreview.id, user_id: user!.id, role: 'member' });

		setLoading(false);
		if (joinError) return toast.error('Failed to join class');

		toast.success(`Joined ${classPreview.name}!`);
		router.push('/dashboard');
	}

	// ── Auth guard ─────────────────────────────────────────────────────────────

	useEffect(() => {
		if (hydrated && !user) {
			// Save the current URL so we can come back after login
			const returnTo = encodeURIComponent(window.location.pathname + window.location.search);
			router.push(`/login?returnTo=${returnTo}`);
		}
	}, [hydrated, user, router]);

	// ── Auto-lookup if code came from URL ──────────────────────────────────────

	useEffect(() => {
		if (hydrated && user && codeFromUrl) {
			lookupCode(codeFromUrl);
		}
	}, [hydrated, user]);

	// ── Guard ──────────────────────────────────────────────────────────────────

	if (!hydrated || !user) {
		return (
			<div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
				<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	// ── Render ─────────────────────────────────────────────────────────────────

	return (
		<div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
			{/* Background blobs */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-20 right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
				<div className="absolute top-40 left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
				<div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
			</div>

			{/* Nav */}
			<nav className="relative z-10">
				<div className="max-w-7xl mx-auto px-6 py-6">
					<Link href="/" className="inline-flex items-center space-x-3">
						<div className="w-10 h-10 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
							<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v18M5 4c3-2 6 2 9 0s6 2 6 2v9s-3-2-6 0-6-2-9 0" />
							</svg>
						</div>
						<span className="text-xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Katsu</span>
					</Link>
				</div>
			</nav>

			{/* Card */}
			<div className="relative z-10 flex-1 flex items-center justify-center px-6">
				<div className="w-full max-w-md animate-fadeInUp">
					<div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-blue-500/10 border border-slate-100 p-8">

						{/* Header */}
						<div className="text-center mb-8">
							<div className="w-14 h-14 bg-linear-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
								<svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
								</svg>
							</div>
							<h1 className="text-2xl font-black text-slate-900">Join a Class</h1>
							<p className="text-slate-500 text-sm mt-1">
								{step === 'code' ? 'Enter the code from your class owner' : `Enter the password for this class`}
							</p>
						</div>

						{/* Step indicator */}
						<div className="flex items-center justify-center space-x-2 mb-7">
							{['code', 'password'].map((s, i) => (
								<div key={s} className="flex items-center space-x-2">
									<div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
										step === s
											? 'bg-blue-600 text-white'
											: i < (['code', 'password'].indexOf(step))
											? 'bg-green-500 text-white'
											: 'bg-slate-100 text-slate-400'
									}`}>
										{i < (['code', 'password'].indexOf(step)) ? (
											<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
											</svg>
										) : i + 1}
									</div>
									{i < 1 && <div className={`w-8 h-0.5 ${i < (['code', 'password'].indexOf(step)) ? 'bg-green-400' : 'bg-slate-200'}`} />}
								</div>
							))}
						</div>

						{/* Step: code */}
						{step === 'code' && (
							<div className="space-y-4">
								<div className="space-y-1.5">
									<label className="text-sm font-medium text-slate-700">Class Code</label>
									<input
										value={code}
										onChange={e => setCode(e.target.value.toUpperCase())}
										onKeyDown={e => e.key === 'Enter' && lookupCode()}
										placeholder="e.g. ABC123"
										maxLength={12}
										className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all font-mono text-center text-lg tracking-widest uppercase"
									/>
								</div>
								<button
									onClick={() => lookupCode()}
									disabled={lookingUp}
									className="w-full py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2"
								>
									{lookingUp ? (
										<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Looking up...</span></>
									) : (
										<span>Find Class →</span>
									)}
								</button>
							</div>
						)}

						{/* Step: password */}
						{step === 'password' && classPreview && (
							<div className="space-y-4">
								<div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-center">
									<p className="text-xs text-blue-500 font-semibold uppercase tracking-wide mb-1">Joining</p>
									<p className="text-xl font-black text-blue-700">{classPreview.name}</p>
								</div>

								<div className="space-y-1.5">
									<label className="text-sm font-medium text-slate-700">Class Password</label>
									<input
										type="password"
										value={password}
										onChange={e => setPassword(e.target.value)}
										onKeyDown={e => e.key === 'Enter' && joinClass()}
										placeholder="Enter the class password"
										className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
									/>
								</div>

								<button
									onClick={joinClass}
									disabled={loading}
									className="w-full py-3 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2"
								>
									{loading ? (
										<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Joining...</span></>
									) : (
										<span>Join Class 🎉</span>
									)}
								</button>

								<button onClick={() => { setStep('code'); setClassPreview(null); setPassword(''); }} className="w-full py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors cursor-pointer">
									← Use a different code
								</button>
							</div>
						)}
					</div>

					<div className="text-center mt-5">
						<Link href="/dashboard" className="text-sm text-slate-400 hover:text-blue-600 transition-colors inline-flex items-center space-x-1">
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
							</svg>
							<span>Back to dashboard</span>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}