'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@lib/supabase';
import { useUserStore } from '@lib/stores/user-store';
import { toast } from 'sonner';

const THRESHOLD_OPTIONS = [
	{ value: 1, label: '1 day before' },
	{ value: 3, label: '3 days before' },
	{ value: 7, label: '7 days before' },
];

interface Props {
	classId: string;
}

export default function NotificationPreferences({ classId }: Props) {
	const user = useUserStore((state) => state.user);
	const supabase = createClient();

	const [enabled, setEnabled]     = useState(true);
	const [thresholds, setThresholds] = useState<number[]>([1, 3, 7]);
	const [loading, setLoading]     = useState(true);
	const [saving, setSaving]       = useState(false);

	// Load prefs for this class whenever classId changes
	useEffect(() => {
		if (!user || !classId) return;

		async function load() {
			setLoading(true);
			const { data, error } = await supabase
				.from('class_members')
				.select('notifications_enabled, notification_thresholds')
				.eq('user_id', user!.id)
				.eq('class_id', classId)
				.single();

			if (error) {
				console.error('Failed to load notification prefs:', error);
			} else if (data) {
				setEnabled(data.notifications_enabled ?? true);
				setThresholds(data.notification_thresholds ?? [1, 3, 7]);
			}
			setLoading(false);
		}

		load();
	}, [classId, user]); // eslint-disable-line react-hooks/exhaustive-deps

	function toggleThreshold(value: number) {
		setThresholds((prev) =>
			prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value],
		);
	}

	async function save() {
		if (!user) return;
		setSaving(true);

		const { error } = await supabase
			.from('class_members')
			.update({
				notifications_enabled: enabled,
				notification_thresholds: thresholds,
			})
			.eq('user_id', user.id)
			.eq('class_id', classId);

		setSaving(false);

		if (error) {
			toast.error('Failed to save notification preferences');
		} else {
			toast.success('Notification preferences saved');
		}
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center py-6">
				<div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	return (
		<div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 space-y-5">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h3 className="font-bold text-slate-900 dark:text-white text-sm">Deadline Notifications</h3>
					<p className="text-xs text-slate-400 mt-0.5">Get emailed when tasks in this class are due soon</p>
				</div>
				{/* Toggle switch */}
				<button
					onClick={() => setEnabled((e) => !e)}
					className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
						enabled ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-600'
					}`}
					role="switch"
					aria-checked={enabled}
				>
					<span
						className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transform transition duration-200 ${
							enabled ? 'translate-x-5' : 'translate-x-0'
						}`}
					/>
				</button>
			</div>

			{/* Threshold options — only shown when enabled */}
			{enabled && (
				<div className="space-y-2">
					<p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Notify me when a task is</p>
					<div className="flex flex-col space-y-1">
						{THRESHOLD_OPTIONS.map((opt) => (
							<label
								key={opt.value}
								className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
							>
								<input
									type="checkbox"
									checked={thresholds.includes(opt.value)}
									onChange={() => toggleThreshold(opt.value)}
									className="w-4 h-4 accent-blue-600 cursor-pointer"
								/>
								<span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{opt.label}</span>
							</label>
						))}
					</div>
				</div>
			)}

			{/* Save button */}
			<button
				onClick={save}
				disabled={saving}
				className="w-full py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2"
			>
				{saving ? (
					<><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Saving...</span></>
				) : (
					<span>Save Preferences</span>
				)}
			</button>
		</div>
	);
}