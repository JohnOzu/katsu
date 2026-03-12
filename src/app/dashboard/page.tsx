'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUserStore } from '@lib/stores/user-store';
import { type Role } from '@lib/mappers'
import { useDashboard } from '@hooks/useDashboard';
import Avatar from '@components/ui/Avatar';
import Modal from '@components/ui/Modal';
import CustomizedInput from '@components/ui/CustomizedInput';
import CustomizedTextArea from '@components/ui/CustomizedTextArea';
import DeadlinePill from '@/src/components/ui/DeadlinePill';
import ThemeToggle from '@/src/components/ui/ThemeToggle';
import MDEditor from '@uiw/react-md-editor';
import ReactMarkdown from 'react-markdown';
import { useTheme } from 'next-themes';
import { stripMarkdown } from '@/src/lib/dashboardUtils';
import NotificationPreferences from '@/src/components/ui/NotificationPreferences';

const canCreate = (role: Role) => ['owner', 'editor', 'contributor'].includes(role);
const canUpdate = (role: Role) => ['owner', 'editor'].includes(role);
const canDelete = (role: Role) => role === 'owner';

const roleBadge: Record<Role, string> = {
	owner:       'bg-purple-100 text-purple-700',
	editor:      'bg-blue-100 text-blue-700',
	contributor: 'bg-green-100 text-green-700',
	member:      'bg-slate-100 text-slate-600',
};

type CompletionFilter = 'all' | 'completed' | 'not-completed';
type DeadlineFilter   = 'all' | 'overdue' | 'today' | 'tomorrow' | '3days' | 'week' | 'no-deadline';
type SortOrder        = 'deadline-asc' | 'deadline-desc' | 'name-asc' | 'created-desc';

export default function DashboardPage() {
	const router = useRouter();
	const hydrated = useUserStore((state) => state.hydrated);
	const db = useDashboard();

	const [completionFilter, setCompletionFilter] = useState<CompletionFilter>('all');
	const [deadlineFilter, setDeadlineFilter] = useState<DeadlineFilter>('all');
	const [subjectFilter, setSubjectFilter] = useState<string>('all');
	const [sortOrder, setSortOrder] = useState<SortOrder>('deadline-asc');
	const [showFilters, setShowFilters] = useState(false);
	const [calendarDate, setCalendarDate] = useState(new Date());
	const [selectedCalendarDay, setSelectedCalendarDay] = useState<Date | null>(null);
	const [viewingTask, setViewingTask] = useState<typeof db.tasks[0] | null>(null);
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const { resolvedTheme } = useTheme();

	useEffect(() => {
		setCompletionFilter('all');
		setDeadlineFilter('all');
		setSubjectFilter('all');
		setSortOrder('deadline-asc');
		setShowFilters(false);
		setSidebarOpen(false);
	}, [db.selectedClass?.id]);

	useEffect(() => {
		if (hydrated && !db.user) router.push('/login');
	}, [hydrated, db.user, router]);

	useEffect(() => {
		if (db.user) db.loadClasses();
	}, [db.user]);

	const filteredTasks = useMemo(() => {
		let result = [...db.tasks];
		if (completionFilter === 'completed') {
			result = result.filter(t => db.completions.some(c => c.taskId === t.id && c.userId === db.user!.id));
		} else if (completionFilter === 'not-completed') {
			result = result.filter(t => !db.completions.some(c => c.taskId === t.id && c.userId === db.user!.id));
		}
		if (subjectFilter !== 'all') {
			result = subjectFilter === 'none'
				? result.filter(t => !t.subjectId)
				: result.filter(t => t.subjectId === subjectFilter);
		}
		if (deadlineFilter !== 'all') {
			const now = new Date();
			result = result.filter(t => {
				if (deadlineFilter === 'no-deadline') return !t.deadline;
				if (!t.deadline) return false;
				const d = new Date(t.deadline);
				const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
				if (deadlineFilter === 'overdue')  return diff < 0;
				if (deadlineFilter === 'today')    return diff === 0;
				if (deadlineFilter === 'tomorrow') return diff === 1;
				if (deadlineFilter === '3days')    return diff >= 0 && diff <= 3;
				if (deadlineFilter === 'week')     return diff >= 0 && diff <= 7;
				return true;
			});
		}
		result.sort((a, b) => {
			if (sortOrder === 'deadline-asc') {
				if (!a.deadline && !b.deadline) return 0;
				if (!a.deadline) return 1;
				if (!b.deadline) return -1;
				return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
			}
			if (sortOrder === 'deadline-desc') {
				if (!a.deadline && !b.deadline) return 0;
				if (!a.deadline) return 1;
				if (!b.deadline) return -1;
				return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
			}
			if (sortOrder === 'name-asc') return a.name.localeCompare(b.name);
			return 0;
		});
		return result;
	}, [db.tasks, db.completions, completionFilter, subjectFilter, deadlineFilter, sortOrder, db.user]);

	const activeFilterCount = [
		completionFilter !== 'all',
		deadlineFilter !== 'all',
		subjectFilter !== 'all',
		sortOrder !== 'deadline-asc',
	].filter(Boolean).length;

	function clearFilters() {
		setCompletionFilter('all');
		setDeadlineFilter('all');
		setSubjectFilter('all');
		setSortOrder('deadline-asc');
	}

	if (!hydrated || !db.user) {
		return (
			<div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 flex items-center justify-center">
				<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	// ── Sidebar content (shared between mobile drawer and desktop) ──
	const SidebarContent = (
		<>
			<div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
				<Link href="/" className="flex items-center space-x-2.5" onClick={() => setSidebarOpen(false)}>
					<div className="w-9 h-9 bg-linear-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
						<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v18M5 4c3-2 6 2 9 0s6 2 6 2v9s-3-2-6 0-6-2-9 0" />
						</svg>
					</div>
					<span className="text-xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Katsu</span>
				</Link>
				<ThemeToggle />
			</div>

			<div className="flex-1 overflow-y-auto px-3 py-4">
				<div className="flex items-center justify-between px-3 mb-2">
					<span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">My Classes</span>
					<div className="flex items-center space-x-1">
						<button onClick={db.openJoinModal} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-green-50 dark:hover:bg-green-900/30 text-slate-400 hover:text-green-600 transition-colors cursor-pointer" title="Join a class">
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
						</button>
						<button onClick={db.openCreateClass} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer" title="Create a class">
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
						</button>
					</div>
				</div>

				{db.loading ? (
					<div className="flex items-center justify-center py-8">
						<div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
					</div>
				) : db.classes.length === 0 ? (
					<div className="px-3 py-6 text-center space-y-2">
						<p className="text-sm text-slate-400">No classes yet</p>
						<button onClick={db.openCreateClass} className="text-sm text-blue-600 hover:underline cursor-pointer block mx-auto">Create one</button>
						<button onClick={db.openJoinModal} className="text-sm text-green-600 hover:underline cursor-pointer block mx-auto">Join one</button>
					</div>
				) : (
					<div className="space-y-1">
						{db.classes.map((c) => (
							<div
								key={c.id}
								onClick={() => { db.selectClass(c); setSidebarOpen(false); }}
								className={`group relative flex items-center px-3 py-2.5 rounded-xl cursor-pointer transition-all ${db.selectedClass?.id === c.id ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
							>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-semibold truncate">{c.name}</p>
									<div className="flex items-center space-x-2 mt-0.5">
										<span className={`text-xs px-1.5 py-0.5 rounded-md font-medium capitalize ${roleBadge[c.myRole]}`}>{c.myRole}</span>
										<span className="text-xs text-slate-400">{c.memberCount} members</span>
									</div>
								</div>
								<div className="hidden group-hover:flex items-center space-x-1 ml-2">
									{canUpdate(c.myRole) && (
										<button onClick={(e) => { e.stopPropagation(); db.openEditClass(c); }} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer">
											<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
										</button>
									)}
									{canDelete(c.myRole) && (
										<button onClick={(e) => { e.stopPropagation(); db.deleteClass(c); }} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 transition-colors cursor-pointer">
											<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
										</button>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			<div className="px-4 py-4 border-t border-slate-100 dark:border-slate-800">
				<div className="flex items-center space-x-3">
					<Avatar profile={{ id: db.user.id, fullName: db.user.user_metadata.full_name, avatarUrl: db.user.user_metadata.avatar_url, email: db.user.email ?? "" }} size={36} />
					<div className="flex-1 min-w-0">
						<p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{db.user.user_metadata.full_name}</p>
						<p className="text-xs text-slate-400 truncate">{db.user.email}</p>
					</div>
					<button
						onClick={async () => { const { signOut } = await import('@lib/auth-actions'); signOut(); }}
						className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
						title="Sign out"
					>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
					</button>
				</div>
			</div>
		</>
	);

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">

			{/* ── Mobile sidebar overlay ── */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* ── Mobile sidebar drawer ── */}
			<aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col transform transition-transform duration-300 md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
				{SidebarContent}
			</aside>

			{/* ── Desktop sidebar ── */}
			<aside className="hidden md:flex w-72 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex-col h-screen sticky top-0">
				{SidebarContent}
			</aside>

			{/* ── Main ── */}
			<main className="flex-1 overflow-y-auto min-w-0">

				{/* Mobile top bar */}
				<div className="md:hidden sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
					<button
						onClick={() => setSidebarOpen(true)}
						className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
					</button>
					<span className="text-sm font-bold text-slate-900 dark:text-white truncate px-2">
						{db.selectedClass?.name ?? 'Dashboard'}
					</span>
					<ThemeToggle />
				</div>

				{!db.selectedClass ? (
					<div className="flex flex-col items-center justify-center min-h-[calc(100vh-57px)] md:min-h-screen text-center px-6">
						<div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/40 rounded-3xl flex items-center justify-center mb-6">
							<svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
							</svg>
						</div>
						<h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Select a class</h2>
						<p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">Choose a class from the sidebar or create a new one to get started.</p>
						<div className="flex flex-col sm:flex-row items-center gap-3">
							<button onClick={db.openCreateClass} className="w-full sm:w-auto px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer">
								Create a Class
							</button>
							<button onClick={db.openJoinModal} className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-semibold hover:border-green-400 hover:shadow-lg transition-all cursor-pointer">
								Join a Class
							</button>
						</div>
					</div>
				) : (
					<div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

						{/* Header */}
						<div className="mb-6 sm:mb-8">
							<div className="flex items-center flex-wrap gap-2 mb-1">
								<h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{db.selectedClass.name}</h1>
								<span className={`text-sm px-2.5 py-1 rounded-lg font-semibold capitalize ${roleBadge[db.selectedClass.myRole]}`}>{db.selectedClass.myRole}</span>
							</div>
							{db.selectedClass.description && <p className="text-slate-500 dark:text-slate-400">{db.selectedClass.description}</p>}
							<div className="flex items-center flex-wrap gap-x-5 gap-y-2 mt-4">
								<span className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
									<span>{db.tasks.length} tasks</span>
								</span>
								<span className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
									<span>{db.subjects.length} subjects</span>
								</span>
								<span className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
									<span>{db.selectedClass.memberCount} members</span>
								</span>
								{db.tasks.length > 0 && (
									<span className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
										<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
										<span>{db.completions.filter(c => c.userId === db.user!.id).length}/{db.tasks.length} done by you</span>
									</span>
								)}
							</div>
						</div>

						{/* Tabs */}
						<div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl mb-6 overflow-x-auto w-full sm:w-fit">
							{(['tasks', 'subjects', 'members', 'calendar'] as const).map((tab) => (
								<button key={tab} onClick={() => db.setActiveTab(tab)} className={`px-4 sm:px-5 py-2 rounded-xl text-sm font-semibold transition-all capitalize cursor-pointer whitespace-nowrap ${db.activeTab === tab ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
									{tab}{tab === 'members' && <span className="ml-1.5 text-xs opacity-60">({db.members.length})</span>}
								</button>
							))}
						</div>

						{/* ── Tasks tab ── */}
						{db.activeTab === 'tasks' && (
							<div>
								<div className="flex items-center justify-between mb-4 gap-2">
									<div className="flex items-center space-x-3">
										<h2 className="text-lg font-bold text-slate-900 dark:text-white">Tasks</h2>
										{filteredTasks.length !== db.tasks.length && (
											<span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 rounded-full font-medium">
												{filteredTasks.length} of {db.tasks.length}
											</span>
										)}
									</div>
									<div className="flex items-center space-x-2">
										<button
											onClick={() => setShowFilters(f => !f)}
											className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer ${showFilters || activeFilterCount > 0 ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'}`}
										>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
											</svg>
											<span>Filter</span>
											{activeFilterCount > 0 && (
												<span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
													{activeFilterCount}
												</span>
											)}
										</button>
										{canCreate(db.selectedClass.myRole) && (
											<button onClick={db.openCreateTask} className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer">
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
												<span className="hidden sm:inline">Add Task</span>
											</button>
										)}
									</div>
								</div>

								{showFilters && (
									<div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 mb-4 space-y-4">
										<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
											<div className="space-y-1.5">
												<label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</label>
												<div className="flex flex-col space-y-1">
													{([
														['all',           'All tasks'],
														['not-completed', 'Not done'],
														['completed',     'Completed'],
													] as [CompletionFilter, string][]).map(([val, label]) => (
														<button key={val} onClick={() => setCompletionFilter(val)} className={`text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${completionFilter === val ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
															{label}
														</button>
													))}
												</div>
											</div>
											<div className="space-y-1.5">
												<label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Subject</label>
												<div className="flex flex-col space-y-1">
													<button onClick={() => setSubjectFilter('all')} className={`text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${subjectFilter === 'all' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>All subjects</button>
													<button onClick={() => setSubjectFilter('none')} className={`text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${subjectFilter === 'none' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>No subject</button>
													{db.subjects.map(s => (
														<button key={s.id} onClick={() => setSubjectFilter(s.id)} className={`text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer truncate ${subjectFilter === s.id ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>{s.name}</button>
													))}
												</div>
											</div>
											<div className="space-y-1.5">
												<label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Deadline</label>
												<div className="flex flex-col space-y-1">
													{([
														['all',         'All deadlines'],
														['overdue',     '🔴 Overdue'],
														['today',       '🟠 Due today'],
														['tomorrow',    '🟡 Due tomorrow'],
														['3days',       '🔵 Within 3 days'],
														['week',        '🟢 Within a week'],
														['no-deadline', '⚪ No deadline'],
													] as [DeadlineFilter, string][]).map(([val, label]) => (
														<button key={val} onClick={() => setDeadlineFilter(val)} className={`text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${deadlineFilter === val ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>{label}</button>
													))}
												</div>
											</div>
											<div className="space-y-1.5">
												<label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sort by</label>
												<div className="flex flex-col space-y-1">
													{([
														['deadline-asc',  'Deadline ↑ earliest'],
														['deadline-desc', 'Deadline ↓ latest'],
														['name-asc',      'Name A → Z'],
														['created-desc',  'Recently added'],
													] as [SortOrder, string][]).map(([val, label]) => (
														<button key={val} onClick={() => setSortOrder(val)} className={`text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${sortOrder === val ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>{label}</button>
													))}
												</div>
											</div>
										</div>
										{activeFilterCount > 0 && (
											<div className="pt-3 border-t border-slate-100 dark:border-slate-700">
												<button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-600 font-medium cursor-pointer transition-colors">Clear all filters</button>
											</div>
										)}
									</div>
								)}

								{filteredTasks.length === 0 ? (
									<div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
										{db.tasks.length === 0 ? (
											<>
												<p className="text-slate-400 font-medium">No tasks yet</p>
												{canCreate(db.selectedClass.myRole) && <p className="text-sm text-slate-400 mt-1">Click "Add Task" to create the first one</p>}
											</>
										) : (
											<>
												<p className="text-slate-400 font-medium">No tasks match your filters</p>
												<button onClick={clearFilters} className="mt-2 text-sm text-blue-600 hover:underline cursor-pointer">Clear filters</button>
											</>
										)}
									</div>
								) : (
									<div className="space-y-3">
										{filteredTasks.map((task) => {
											const myCompletion = db.completions.find(c => c.taskId === task.id && c.userId === db.user!.id);
											const isDone = !!myCompletion;
											const subject = db.subjects.find(s => s.id === task.subjectId);
											const publicCompletions = db.completions.filter(c => c.taskId === task.id && c.isPublic);
											const totalCompletions = db.completions.filter(c => c.taskId === task.id).length;

											return (
												<div
													key={task.id}
													onClick={() => setViewingTask(task)}
													className={`group bg-white dark:bg-slate-800 rounded-2xl border transition-all hover:shadow-md hover:scale-101 cursor-pointer ${isDone ? 'border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-900/10' : 'border-slate-100 dark:border-slate-700'}`}
												>
													<div className="flex items-start p-4 space-x-3 sm:space-x-4">
														<button
															onClick={(e) => { e.stopPropagation(); db.toggleCompletion(task, myCompletion?.isPublic ?? true); }}
															className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer ${isDone ? 'bg-green-500 border-green-500' : 'border-slate-300 dark:border-slate-600 hover:border-green-400'}`}
														>
															{isDone && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
														</button>
														<div className="flex-1 min-w-0 space-y-2">
															<p className={`font-semibold ${isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>{task.name}</p>
															{task.description && <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{stripMarkdown(task.description)}</p>}
															<DeadlinePill deadline={task.deadline} />
															<div className="flex items-center flex-wrap gap-2">
																{subject && <span className="text-xs px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-md font-medium border border-indigo-100 dark:border-indigo-800">{subject.name}</span>}
																{totalCompletions > 0 && <span className="text-xs px-2 py-0.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 rounded-md font-medium border border-green-100 dark:border-green-800">✓ {totalCompletions} done</span>}
															</div>
															{publicCompletions.length > 0 && (
																<div className="flex items-center space-x-1 mt-2">
																	{publicCompletions.slice(0, 5).map(c => <Avatar key={c.userId} profile={db.memberProfiles[c.userId]} size={20} />)}
																	{publicCompletions.length > 5 && <span className="text-xs text-slate-400 ml-1">+{publicCompletions.length - 5} more</span>}
																</div>
															)}
															{isDone && (
																<label className="flex items-center space-x-2 mt-2 cursor-pointer">
																	<input type="checkbox" checked={myCompletion?.isPublic ?? true} onChange={(e) => { e.stopPropagation(); db.updateCompletionVisibility(task.id, e.target.checked); }} className="w-3.5 h-3.5 accent-blue-600" />
																	<span className="text-xs text-slate-400">Let others see I completed this</span>
																</label>
															)}
														</div>
														<div className="hidden group-hover:flex items-center space-x-1 shrink-0">
															{db.selectedClass && canUpdate(db.selectedClass.myRole) && (
																<button onClick={(e) => { e.stopPropagation(); db.openEditTask(task); }} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer">
																	<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
																</button>
															)}
															{db.selectedClass && canDelete(db.selectedClass?.myRole) && (
																<button onClick={(e) => { e.stopPropagation(); db.deleteTask(task); }} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors cursor-pointer">
																	<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
																</button>
															)}
														</div>
													</div>
												</div>
											);
										})}
									</div>
								)}
							</div>
						)}

						{/* ── Subjects tab ── */}
						{db.activeTab === 'subjects' && (
							<div>
								<div className="flex items-center justify-between mb-4">
									<h2 className="text-lg font-bold text-slate-900 dark:text-white">Subjects</h2>
									{canCreate(db.selectedClass.myRole) && (
										<button onClick={db.openCreateSubject} className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer">
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
											<span className="hidden sm:inline">Add Subject</span>
										</button>
									)}
								</div>
								{db.subjects.length === 0 ? (
									<div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
										<p className="text-slate-400 font-medium">No subjects yet</p>
									</div>
								) : (
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
										{db.subjects.map((s) => {
											const taskCount = db.tasks.filter(t => t.subjectId === s.id).length;
											return (
												<div key={s.id} className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 hover:shadow-md transition-all">
													<div className="flex items-start justify-between mb-2">
														<div className="w-10 h-10 bg-linear-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40 rounded-xl flex items-center justify-center">
															<svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
														</div>
														<div className="hidden group-hover:flex items-center space-x-1">
															{db.selectedClass && canUpdate(db.selectedClass.myRole!) && (
																<button onClick={() => db.openEditSubject(s)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer">
																	<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
																</button>
															)}
															{db.selectedClass && canDelete(db.selectedClass.myRole!) && (
																<button onClick={() => db.deleteSubject(s)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors cursor-pointer">
																	<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
																</button>
															)}
														</div>
													</div>
													<h3 className="font-bold text-slate-900 dark:text-white mt-3">{s.name}</h3>
													{s.description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{s.description}</p>}
													<p className="text-xs text-slate-400 mt-3">{taskCount} task{taskCount !== 1 ? 's' : ''}</p>
												</div>
											);
										})}
									</div>
								)}
							</div>
						)}

						{/* ── Members tab ── */}
						{db.activeTab === 'members' && (
							<div className="space-y-6">
								{db.selectedClass.myRole === 'owner' && (
									<div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4 sm:p-5">
										<div className="flex items-center justify-between mb-4 gap-2">
											<div>
												<h3 className="font-bold text-slate-900 dark:text-white">Invite Links & Codes</h3>
												<p className="text-sm text-slate-400 mt-0.5">Share a code or link so classmates can join</p>
											</div>
											<button
												onClick={db.openInviteModal}
												disabled={db.invites.length >= 1}
												className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
											>
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
												<span className="hidden sm:inline">New Invite</span>
											</button>
										</div>
										{db.invites.length === 0 ? (
											<p className="text-sm text-slate-400 text-center py-4">No invites yet</p>
										) : (
											<div className="space-y-2">
												{db.invites.map((invite) => (
													<div key={invite.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700">
														<div className="flex items-center space-x-6">
															<div>
																<p className="text-xs text-slate-400 font-medium">Code</p>
																<p className="font-mono font-bold text-slate-900 dark:text-white tracking-widest">{invite.code}</p>
															</div>
															<div>
																<p className="text-xs text-slate-400 font-medium">Password</p>
																<p className="font-mono text-slate-600 dark:text-slate-300 text-sm">{invite.password}</p>
															</div>
														</div>
														<div className="flex items-center space-x-2 flex-wrap gap-y-1">
															<button onClick={() => db.copyCode(invite.code)} className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors cursor-pointer">
																<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
																<span>Copy code</span>
															</button>
															<button onClick={() => db.copyInviteLink(invite)} className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors cursor-pointer">
																<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
																<span>Copy link</span>
															</button>
															<button onClick={() => db.deleteInvite(invite.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors cursor-pointer">
																<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
															</button>
														</div>
													</div>
												))}
											</div>
										)}
									</div>
								)}

								{/* Members list */}
								<div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
									<div className="hidden sm:grid grid-cols-12 px-5 py-2.5 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700 text-xs font-semibold text-slate-400 uppercase tracking-wider">
										<span className="col-span-6">Member</span>
										<span className="col-span-3">Role</span>
										<span className="col-span-3 text-right">{db.selectedClass.myRole === 'owner' ? 'Actions' : ''}</span>
									</div>
									{db.members.map((m) => {
										const isMe = m.userId === db.user!.id;
										const profile = db.memberProfiles[m.userId];
										return (
											<div key={m.userId} className="flex flex-col sm:grid sm:grid-cols-12 sm:items-center px-4 sm:px-5 py-3.5 border-b border-slate-50 dark:border-slate-700/50 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors gap-2 sm:gap-0">
												<div className="sm:col-span-6 flex items-center space-x-3">
													<Avatar profile={profile} size={32} />
													<div>
														<p className="text-sm font-semibold text-slate-900 dark:text-white">
															{profile?.fullName ?? 'Loading...'}
															{isMe && <span className="ml-1.5 text-xs text-slate-400 font-normal">(you)</span>}
														</p>
														<p className="text-xs text-slate-400">{profile?.email ?? ''}</p>
													</div>
												</div>
												<div className="sm:col-span-3 flex items-center justify-between sm:justify-start">
													<span className={`text-xs px-2.5 py-1 rounded-lg font-semibold capitalize ${roleBadge[m.role]}`}>{m.role}</span>
													{/* Actions on mobile inline */}
													<div className="flex sm:hidden items-center space-x-2">
														{db.selectedClass && db.selectedClass.myRole === 'owner' && !isMe && (
															<>
																<select value={m.role} onChange={(e) => db.updateMemberRole(m.userId, e.target.value as Role)} className="text-xs px-2 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none bg-white dark:bg-slate-700 cursor-pointer">
																	<option value="editor">Editor</option>
																	<option value="contributor">Contributor</option>
																	<option value="member">Member</option>
																</select>
																<button onClick={() => db.removeMember(m.userId)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors cursor-pointer">
																	<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" /></svg>
																</button>
															</>
														)}
														{isMe && db.selectedClass && db.selectedClass.myRole !== 'owner' && (
															<button onClick={() => db.removeMember(db.user!.id)} className="flex items-center space-x-1 px-2 py-1.5 text-xs font-medium text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer">
																<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
																<span>Leave</span>
															</button>
														)}
													</div>
												</div>
												{/* Desktop actions */}
												<div className="hidden sm:flex sm:col-span-3 items-center justify-end space-x-2">
													{db.selectedClass && db.selectedClass.myRole === 'owner' && !isMe && (
														<>
															<select value={m.role} onChange={(e) => db.updateMemberRole(m.userId, e.target.value as Role)} className="text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all cursor-pointer bg-white dark:bg-slate-700">
																<option value="editor">Editor</option>
																<option value="contributor">Contributor</option>
																<option value="member">Member</option>
															</select>
															<button onClick={() => db.removeMember(m.userId)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors cursor-pointer">
																<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" /></svg>
															</button>
														</>
													)}
													{isMe && db.selectedClass && db.selectedClass.myRole !== 'owner' && (
														<button onClick={() => db.removeMember(db.user!.id)} className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer">
															<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
															<span>Leave</span>
														</button>
													)}
												</div>
											</div>
										);
									})}
								</div>

								<div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
									<p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Role Permissions</p>
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
										{([
											{ role: 'owner', desc: 'Full access — create, edit, delete, manage members & invites' },
											{ role: 'editor', desc: 'Create and edit tasks & subjects, no delete' },
											{ role: 'contributor', desc: 'Create tasks & subjects only' },
											{ role: 'member', desc: 'View only — can mark tasks as done' },
										] as { role: Role; desc: string }[]).map(({ role, desc }) => (
											<div key={role} className="space-y-1">
												<span className={`text-xs px-2 py-0.5 rounded-md font-semibold capitalize inline-block ${roleBadge[role]}`}>{role}</span>
												<p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
											</div>
										))}
									</div>
								</div>
								<NotificationPreferences classId={db.selectedClass!.id} />
							</div>
						)}

						{/* ── Calendar tab ── */}
						{db.activeTab === 'calendar' && (() => {
							const year  = calendarDate.getFullYear();
							const month = calendarDate.getMonth();
							const firstDay   = new Date(year, month, 1).getDay();
							const daysInMonth = new Date(year, month + 1, 0).getDate();
							const today      = new Date();

							const tasksByDay: Record<number, typeof db.tasks> = {};
							db.tasks.forEach(task => {
								if (!task.deadline) return;
								const d = new Date(task.deadline);
								if (d.getFullYear() === year && d.getMonth() === month) {
									const day = d.getDate();
									if (!tasksByDay[day]) tasksByDay[day] = [];
									tasksByDay[day].push(task);
								}
							});

							const selectedDayTasks = selectedCalendarDay
								? (tasksByDay[selectedCalendarDay.getDate()] ?? [])
								: [];

							const monthName = calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

							function dotColor(deadline: string): string {
								const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
								if (diff < 0)  return 'bg-red-500';
								if (diff === 0) return 'bg-orange-500';
								if (diff <= 3) return 'bg-yellow-500';
								if (diff <= 7) return 'bg-blue-500';
								return 'bg-green-500';
							}

							return (
								<div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
									{/* Calendar grid */}
									<div className="flex-1 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 overflow-hidden">
										<div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-700">
											<button onClick={() => { setCalendarDate(new Date(year, month - 1, 1)); setSelectedCalendarDay(null); }} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer">
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
											</button>
											<h3 className="text-base font-bold text-slate-900 dark:text-white">{monthName}</h3>
											<button onClick={() => { setCalendarDate(new Date(year, month + 1, 1)); setSelectedCalendarDay(null); }} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer">
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
											</button>
										</div>
										<div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-700">
											{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
												<div key={i} className="py-2 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">{d}</div>
											))}
										</div>
										<div className="grid grid-cols-7">
											{Array.from({ length: firstDay }).map((_, i) => (
												<div key={`empty-${i}`} className="min-h-[60px] sm:min-h-[80px] border-b border-r border-slate-50 dark:border-slate-700/50" />
											))}
											{Array.from({ length: daysInMonth }).map((_, i) => {
												const day = i + 1;
												const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
												const isSelected = selectedCalendarDay?.getDate() === day && selectedCalendarDay?.getMonth() === month && selectedCalendarDay?.getFullYear() === year;
												const dayTasks = tasksByDay[day] ?? [];
												const col = (firstDay + i) % 7;
												const isLastCol = col === 6;

												return (
													<div
														key={day}
														onClick={() => setSelectedCalendarDay(isSelected ? null : new Date(year, month, day))}
														className={`min-h-[60px] sm:min-h-[80px] p-1 sm:p-2 border-b border-slate-50 dark:border-slate-700/50 cursor-pointer transition-colors ${!isLastCol ? 'border-r' : ''} ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'}`}
													>
														<div className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full text-xs sm:text-sm font-semibold mb-1 ${isToday ? 'bg-blue-600 text-white' : isSelected ? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}>
															{day}
														</div>
														<div className="space-y-0.5">
															{dayTasks.slice(0, 2).map(task => {
																const isDone = db.completions.some(c => c.taskId === task.id && c.userId === db.user!.id);
																return (
																	<div key={task.id} className={`hidden sm:flex items-center space-x-1 px-1.5 py-0.5 rounded-md ${isDone ? 'bg-green-50 dark:bg-green-900/20' : 'bg-slate-100 dark:bg-slate-700'}`}>
																		<div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isDone ? 'bg-green-500' : dotColor(task.deadline!)}`} />
																		<span className={`text-[10px] font-medium truncate ${isDone ? 'text-green-600 dark:text-green-400 line-through' : 'text-slate-600 dark:text-slate-300'}`}>{task.name}</span>
																	</div>
																);
															})}
															{/* Mobile: just show dots */}
															{dayTasks.length > 0 && (
																<div className="flex sm:hidden items-center gap-0.5 flex-wrap">
																	{dayTasks.slice(0, 3).map(task => {
																		const isDone = db.completions.some(c => c.taskId === task.id && c.userId === db.user!.id);
																		return <div key={task.id} className={`w-1.5 h-1.5 rounded-full ${isDone ? 'bg-green-500' : dotColor(task.deadline!)}`} />;
																	})}
																</div>
															)}
															{dayTasks.length > 2 && <p className="hidden sm:block text-[10px] text-slate-400 pl-1">+{dayTasks.length - 2} more</p>}
														</div>
													</div>
												);
											})}
										</div>
										<div className="flex items-center flex-wrap gap-x-4 gap-y-1 px-4 sm:px-6 py-3 border-t border-slate-100 dark:border-slate-700">
											<span className="text-xs text-slate-400 font-medium">Urgency:</span>
											{[{ color: 'bg-red-500', label: 'Overdue' }, { color: 'bg-orange-500', label: 'Today' }, { color: 'bg-yellow-500', label: '≤3d' }, { color: 'bg-blue-500', label: '≤1w' }, { color: 'bg-green-500', label: 'Later' }].map(({ color, label }) => (
												<div key={label} className="flex items-center space-x-1.5">
													<div className={`w-2 h-2 rounded-full ${color}`} />
													<span className="text-xs text-slate-400">{label}</span>
												</div>
											))}
										</div>
									</div>

									{/* Side panel — stacks below on mobile */}
									<div className="lg:w-72 shrink-0">
										{selectedCalendarDay ? (
											<div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 overflow-hidden">
												<div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
													<p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{selectedCalendarDay.toLocaleDateString('en-US', { weekday: 'long' })}</p>
													<h3 className="text-lg font-black text-slate-900 dark:text-white">{selectedCalendarDay.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h3>
												</div>
												<div className="p-4 space-y-3 max-h-[400px] lg:max-h-[500px] overflow-y-auto">
													{selectedDayTasks.length === 0 ? (
														<p className="text-sm text-slate-400 text-center py-6">No tasks due this day</p>
													) : selectedDayTasks.map(task => {
														const isDone = db.completions.some(c => c.taskId === task.id && c.userId === db.user!.id);
														const subject = db.subjects.find(s => s.id === task.subjectId);
														const time = new Date(task.deadline!).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
														return (
															<div key={task.id} className={`p-3 rounded-2xl border transition-all ${isDone ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' : 'bg-slate-50 dark:bg-slate-700/50 border-slate-100 dark:border-slate-700'}`}>
																<div className="flex items-start space-x-2.5">
																	<button onClick={(e) => { e.stopPropagation(); db.toggleCompletion(task, true); }} className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer ${isDone ? 'bg-green-500 border-green-500' : 'border-slate-300 dark:border-slate-500 hover:border-green-400'}`}>
																		{isDone && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
																	</button>
																	<div className="flex-1 min-w-0">
																		<p className={`text-sm font-semibold ${isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>{task.name}</p>
																		{task.description && <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{task.description}</p>}
																		<div className="flex items-center flex-wrap gap-1.5 mt-1.5">
																			<span className="text-xs text-slate-400">⏰ {time}</span>
																			{subject && <span className="text-xs px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-md font-medium border border-indigo-100 dark:border-indigo-800">{subject.name}</span>}
																		</div>
																	</div>
																</div>
															</div>
														);
													})}
												</div>
											</div>
										) : (
											<div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 text-center">
												<div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
													<svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
												</div>
												<p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Pick a day</p>
												<p className="text-xs text-slate-400">Click any date on the calendar to see tasks due that day.</p>
												{Object.keys(tasksByDay).length > 0 && (
													<div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 text-left space-y-1.5">
														<p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">This month</p>
														{Object.entries(tasksByDay).sort(([a], [b]) => Number(a) - Number(b)).slice(0, 6).map(([day, tasks]) => (
															<button key={day} onClick={() => setSelectedCalendarDay(new Date(year, month, Number(day)))} className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group">
																<span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{new Date(year, month, Number(day)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
																<span className="text-xs text-slate-400 group-hover:text-blue-500 transition-colors">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</span>
															</button>
														))}
													</div>
												)}
											</div>
										)}
									</div>
								</div>
							);
						})()}
					</div>
				)}
			</main>

			{/* ── Modals (unchanged) ── */}
			{db.showClassModal && (
				<Modal title={db.editingClass ? 'Edit Class' : 'Create Class'} onClose={db.closeClassModal}>
					<div className="space-y-4">
						<CustomizedInput label="Class Name" placeholder="e.g. BSCS 3-A" value={db.classForm.name} onChange={e => db.setClassForm(f => ({ ...f, name: e.target.value }))} />
						<CustomizedTextArea label="Description (optional)" placeholder="What's this class about?" value={db.classForm.description} onChange={e => db.setClassForm(f => ({ ...f, description: e.target.value }))} />
						<button onClick={db.saveClass} className="w-full py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all cursor-pointer">{db.editingClass ? 'Save Changes' : 'Create Class'}</button>
					</div>
				</Modal>
			)}
			{db.showSubjectModal && (
				<Modal title={db.editingSubject ? 'Edit Subject' : 'Add Subject'} onClose={db.closeSubjectModal}>
					<div className="space-y-4">
						<CustomizedInput label="Subject Name" placeholder="e.g. Mathematics, English" value={db.subjectForm.name} onChange={e => db.setSubjectForm(f => ({ ...f, name: e.target.value }))} />
						<CustomizedTextArea label="Description (optional)" placeholder="Brief description..." value={db.subjectForm.description} onChange={e => db.setSubjectForm(f => ({ ...f, description: e.target.value }))} />
						<button onClick={db.saveSubject} className="w-full py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all cursor-pointer">{db.editingSubject ? 'Save Changes' : 'Add Subject'}</button>
					</div>
				</Modal>
			)}
			{db.showTaskModal && (
				<Modal title={db.editingTask ? 'Edit Task' : 'Add Task'} onClose={db.closeTaskModal}>
					<div className="space-y-4">
						<CustomizedInput label="Task Name" placeholder="e.g. Chapter 5 Assignment" value={db.taskForm.name} onChange={e => db.setTaskForm(f => ({ ...f, name: e.target.value }))} />
						<div className="space-y-1.5">
							<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description (optional)</label>
							<div data-color-mode={resolvedTheme === 'dark' ? 'dark' : 'light'} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600">
								<MDEditor value={db.taskForm.description} onChange={(val) => db.setTaskForm(f => ({ ...f, description: val ?? '' }))} preview="edit" height={200} style={{ borderRadius: '0.75rem', resize: 'none' }} />
							</div>
						</div>
						<CustomizedInput label="Deadline (optional)" type="datetime-local" value={db.taskForm.deadline} onChange={e => db.setTaskForm(f => ({ ...f, deadline: e.target.value }))} />
						<div className="space-y-1.5">
							<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Subject (optional)</label>
							<select value={db.taskForm.subject_id} onChange={e => db.setTaskForm(f => ({ ...f, subject_id: e.target.value }))} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all">
								<option value="">No subject</option>
								{db.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
							</select>
						</div>
						<button onClick={db.saveTask} className="w-full py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all cursor-pointer">{db.editingTask ? 'Save Changes' : 'Add Task'}</button>
					</div>
				</Modal>
			)}
			{db.showInviteModal && (
				<Modal title="Create Invite" onClose={db.closeInviteModal}>
					{db.createdInvite ? (
						<div className="space-y-4">
							<div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-2xl text-center">
								<p className="text-sm font-medium text-green-700 dark:text-green-300 mb-3">Invite created!</p>
								<div className="space-y-2">
									<div className="flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded-xl border border-green-200 dark:border-green-800">
										<div>
											<p className="text-xs text-slate-400">Class Code</p>
											<p className="font-mono font-black text-2xl tracking-widest text-slate-900 dark:text-white">{db.createdInvite.code}</p>
										</div>
										<button onClick={() => db.copyCode(db.createdInvite!.code)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors cursor-pointer text-slate-400 hover:text-blue-600">
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
										</button>
									</div>
									<div className="p-3 bg-white dark:bg-slate-700 rounded-xl border border-green-200 dark:border-green-800">
										<p className="text-xs text-slate-400">Password</p>
										<p className="font-mono font-bold text-slate-900 dark:text-white">{db.createdInvite.password}</p>
									</div>
								</div>
							</div>
							<button onClick={() => db.copyInviteLink(db.createdInvite!)} className="w-full py-3 flex items-center justify-center space-x-2 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:border-blue-400 transition-all cursor-pointer">
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
								<span>Copy Invite Link</span>
							</button>
						</div>
					) : (
						<div className="space-y-4">
							<div className="space-y-3">
								<p className="text-sm font-medium text-slate-700 dark:text-slate-300">Password type</p>
								<div className="grid grid-cols-2 gap-2">
									<button onClick={() => db.setInviteForm(f => ({ ...f, useGenerated: true }))} className={`p-3 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer ${db.inviteForm.useGenerated ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400'}`}>🎲 Auto-generate</button>
									<button onClick={() => db.setInviteForm(f => ({ ...f, useGenerated: false }))} className={`p-3 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer ${!db.inviteForm.useGenerated ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400'}`}>✏️ Set my own</button>
								</div>
							</div>
							{!db.inviteForm.useGenerated && <CustomizedInput label="Password" placeholder="Enter a password for this invite" value={db.inviteForm.password} onChange={e => db.setInviteForm(f => ({ ...f, password: e.target.value }))} />}
							<button onClick={db.createInvite} className="w-full py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all cursor-pointer">Create Invite</button>
						</div>
					)}
				</Modal>
			)}
			{db.showJoinModal && (
				<Modal title="Join a Class" onClose={db.closeJoinModal}>
					<div className="space-y-4">
						{db.joinStep === 'code' ? (
							<>
								<div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-700">
									<p className="text-sm text-slate-500 dark:text-slate-400">Ask your class owner for the invite code</p>
								</div>
								<CustomizedInput label="Class Code" placeholder="e.g. ABC123" value={db.joinForm.code} onChange={e => db.setJoinForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} maxLength={12} />
								<button onClick={db.lookupCode} disabled={db.joinLoading} className="w-full py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all cursor-pointer disabled:opacity-50">{db.joinLoading ? 'Looking up...' : 'Find Class'}</button>
							</>
						) : (
							<>
								<div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-2xl text-center">
									<p className="text-xs text-blue-500 dark:text-blue-400 font-medium mb-1">Joining</p>
									<p className="text-lg font-black text-blue-700 dark:text-blue-300">{db.joinClassPreview?.name}</p>
								</div>
								<CustomizedInput label="Class Password" type="password" placeholder="Enter the class password" value={db.joinForm.password} onChange={e => db.setJoinForm(f => ({ ...f, password: e.target.value }))} />
								<button onClick={db.joinClass} disabled={db.joinLoading} className="w-full py-3 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all cursor-pointer disabled:opacity-50">{db.joinLoading ? 'Joining...' : 'Join Class'}</button>
								<button onClick={() => db.setJoinStep('code')} className="w-full py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer">← Back</button>
							</>
						)}
					</div>
				</Modal>
			)}

			{/* ── Task Detail Modal ── */}
			{viewingTask && (() => {
				const task = viewingTask;
				const isDone = db.completions.some(c => c.taskId === task.id && c.userId === db.user!.id);
				const subject = db.subjects.find(s => s.id === task.subjectId);
				const publicCompletions = db.completions.filter(c => c.taskId === task.id && c.isPublic);
				const totalCompletions = db.completions.filter(c => c.taskId === task.id).length;
				const myCompletion = db.completions.find(c => c.taskId === task.id && c.userId === db.user!.id);

				return (
					<div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm" onClick={() => setViewingTask(null)}>
						<div className="w-full sm:max-w-2xl bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-fadeInUp" onClick={e => e.stopPropagation()}>
							<div className="flex items-start justify-between px-5 sm:px-6 py-5 border-b border-slate-100 dark:border-slate-700">
								<div className="flex items-start space-x-3 flex-1 min-w-0">
									<button onClick={() => db.toggleCompletion(task, myCompletion?.isPublic ?? true)} className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer ${isDone ? 'bg-green-500 border-green-500' : 'border-slate-300 dark:border-slate-500 hover:border-green-400'}`}>
										{isDone && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
									</button>
									<div className="flex-1 min-w-0">
										<h2 className={`text-lg sm:text-xl font-black ${isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>{task.name}</h2>
										<div className="flex items-center flex-wrap gap-2 mt-2">
											{subject && <span className="text-xs px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-md font-medium border border-indigo-100 dark:border-indigo-800">{subject.name}</span>}
											{totalCompletions > 0 && <span className="text-xs px-2 py-0.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 rounded-md font-medium border border-green-100 dark:border-green-800">✓ {totalCompletions} done</span>}
											{isDone && <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-md font-semibold">You completed this</span>}
										</div>
									</div>
								</div>
								<div className="flex items-center space-x-1 ml-3 shrink-0">
									{canUpdate(db.selectedClass!.myRole) && (
										<button onClick={() => { setViewingTask(null); db.openEditTask(task); }} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer">
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
										</button>
									)}
									<button onClick={() => setViewingTask(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer">
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
									</button>
								</div>
							</div>
							{task.deadline && <div className="px-5 sm:px-6 pt-4"><DeadlinePill deadline={task.deadline} /></div>}
							<div className="px-5 sm:px-6 py-5 max-h-[50vh] sm:max-h-[400px] overflow-y-auto">
								{task.description ? (
									<div data-color-mode="auto">
										<div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-strong:text-slate-900 dark:prose-strong:text-white prose-code:bg-slate-100 dark:prose-code:bg-slate-700 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-ul:text-slate-600 dark:prose-ul:text-slate-300 prose-ol:text-slate-600 dark:prose-ol:text-slate-300 prose-blockquote:border-blue-400 prose-blockquote:text-slate-500 dark:prose-blockquote:text-slate-400 prose-hr:border-slate-200 dark:prose-hr:border-slate-700">
											<ReactMarkdown>{task.description}</ReactMarkdown>
										</div>
									</div>
								) : (
									<p className="text-sm text-slate-400 italic">No description provided.</p>
								)}
							</div>
							{publicCompletions.length > 0 && (
								<div className="px-5 sm:px-6 pb-5">
									<p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Completed by</p>
									<div className="flex items-center space-x-1.5">
										{publicCompletions.slice(0, 8).map(c => <Avatar key={c.userId} profile={db.memberProfiles[c.userId]} size={28} />)}
										{publicCompletions.length > 8 && <span className="text-xs text-slate-400 ml-1">+{publicCompletions.length - 8} more</span>}
									</div>
								</div>
							)}
							{isDone && (
								<div className="px-5 sm:px-6 pb-5 border-t border-slate-50 dark:border-slate-700 pt-4">
									<label className="flex items-center space-x-2 cursor-pointer">
										<input type="checkbox" checked={myCompletion?.isPublic ?? true} onChange={(e) => { e.stopPropagation(); db.updateCompletionVisibility(task.id, e.target.checked); }} className="w-3.5 h-3.5 accent-blue-600" />
										<span className="text-xs text-slate-400">Let others see I completed this</span>
									</label>
								</div>
							)}
						</div>
					</div>
				);
			})()}
		</div>
	);
}