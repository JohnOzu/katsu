import { useState } from 'react';
import { createClient } from '@lib/supabase';
import { useUserStore } from '@lib/stores/user-store';
import {
	type Role,
	type ClassItem,
	type ClassMember,
	type Profile,
	type Subject,
	type Task,
	type ClassInvite,
	type TaskCompletion,
	mapClass,
	mapClassMember,
	mapProfile,
	mapSubject,
	mapTask,
	mapClassInvite,
	mapTaskCompletion,
} from '@lib/mappers';
import { generateCode, generatePassword } from '@lib/dashboardUtils';
import { toast } from 'sonner';

// ─── Form state types ─────────────────────────────────────────────────────────

export type ClassForm   = { name: string; description: string };
export type SubjectForm = { name: string; description: string };
export type TaskForm    = { name: string; description: string; deadline: string; subject_id: string };
export type InviteForm  = { password: string; useGenerated: boolean };
export type JoinForm    = { code: string; password: string };
export type JoinPreview = { name: string; id: string; inviteId: string };

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDashboard() {
	const user = useUserStore((state) => state.user);
	const supabase = createClient();

	// ── Data state ─────────────────────────────────────────────────────────────

	const [classes, setClasses] = useState<ClassItem[]>([]);
	const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [tasks, setTasks] = useState<Task[]>([]);
	const [members, setMembers] = useState<ClassMember[]>([]);
	const [memberProfiles, setMemberProfiles] = useState<Record<string, Profile>>({});
	const [completions, setCompletions] = useState<TaskCompletion[]>([]);
	const [invites, setInvites] = useState<ClassInvite[]>([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<'tasks' | 'subjects' | 'members' | 'calendar'>('tasks');

	// ── Modal visibility ───────────────────────────────────────────────────────

	const [showClassModal, setShowClassModal] = useState(false);
	const [showSubjectModal, setShowSubjectModal] = useState(false);
	const [showTaskModal, setShowTaskModal] = useState(false);
	const [showInviteModal, setShowInviteModal] = useState(false);
	const [showJoinModal, setShowJoinModal] = useState(false);

	// ── Editing state ──────────────────────────────────────────────────────────

	const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
	const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
	const [editingTask, setEditingTask] = useState<Task | null>(null);
	const [createdInvite, setCreatedInvite] = useState<ClassInvite | null>(null);

	// ── Form state ─────────────────────────────────────────────────────────────

	const [classForm, setClassForm] = useState<ClassForm>({ name: '', description: '' });
	const [subjectForm, setSubjectForm] = useState<SubjectForm>({ name: '', description: '' });
	const [taskForm, setTaskForm] = useState<TaskForm>({ name: '', description: '', deadline: '', subject_id: '' });
	const [inviteForm, setInviteForm] = useState<InviteForm>({ password: '', useGenerated: true });
	const [joinForm, setJoinForm] = useState<JoinForm>({ code: '', password: '' });
	const [joinStep, setJoinStep] = useState<'code' | 'password'>('code');
	const [joinClassPreview, setJoinClassPreview] = useState<JoinPreview | null>(null);
	const [joinLoading, setJoinLoading] = useState(false);

	// ── Classes ────────────────────────────────────────────────────────────────

	async function loadClasses() {
		setLoading(true);
		const { data, error } = await supabase
			.from('class_members')
			.select('role, class_id, classes(id, name, description, created_by, created_at)')
			.eq('user_id', user!.id);

		if (error) { toast.error('Failed to load classes'); setLoading(false); return; }

		const list: ClassItem[] = (data || []).map((row: any) => mapClass(row.classes, row.role));

		for (const c of list) {
			const { count } = await supabase
				.from('class_members')
				.select('*', { count: 'exact', head: true })
				.eq('class_id', c.id);
			c.memberCount = count ?? 0;
		}

		setClasses(list);
		setLoading(false);
	}

	async function loadClassData(classId: string) {
		const tasksSnap = await supabase.from('tasks').select('id').eq('class_id', classId);
		const taskIds = tasksSnap.data?.map((t: any) => t.id) ?? [];

		const [subjectsRes, tasksRes, membersRes, invitesRes, completionsRes] = await Promise.all([
			supabase.from('class_subjects').select('*').eq('class_id', classId),
			supabase.from('tasks').select('*').eq('class_id', classId).order('deadline', { ascending: true, nullsFirst: false }),
			supabase.from('class_members').select('*').eq('class_id', classId),
			supabase.from('class_invites').select('*').eq('class_id', classId),
			taskIds.length > 0
				? supabase.from('task_completions').select('*').in('task_id', taskIds)
				: Promise.resolve({ data: [] }),
		]);

		if (subjectsRes.data) setSubjects(subjectsRes.data.map(mapSubject));
		if (tasksRes.data) setTasks(tasksRes.data.map(mapTask));
		if (membersRes.data) {
			const mapped = membersRes.data.map(mapClassMember);
			setMembers(mapped);
			loadMemberProfiles(mapped);
		}
		if (invitesRes.data) setInvites(invitesRes.data.map(mapClassInvite));
		if (completionsRes.data) setCompletions((completionsRes.data as any[]).map(mapTaskCompletion));
	}

	async function loadMemberProfiles(memberList: ClassMember[]) {
		const ids = memberList.map(m => m.userId);
		const { data } = await supabase.from('profiles').select('*').in('id', ids);
		if (data) {
			const map: Record<string, Profile> = {};
			data.forEach((p: any) => { map[p.id] = mapProfile(p); });
			setMemberProfiles(map);
		}
	}

	function selectClass(c: ClassItem) {
		setSelectedClass(c);
		setActiveTab('tasks');
		loadClassData(c.id);
	}

	// ── Class modal helpers ────────────────────────────────────────────────────

	function openCreateClass() {
		setEditingClass(null);
		setClassForm({ name: '', description: '' });
		setShowClassModal(true);
	}

	function openEditClass(c: ClassItem) {
		setEditingClass(c);
		setClassForm({ name: c.name, description: c.description ?? '' });
		setShowClassModal(true);
	}

	function closeClassModal() {
		setShowClassModal(false);
		setEditingClass(null);
		setClassForm({ name: '', description: '' });
	}

	// ── Class CRUD ─────────────────────────────────────────────────────────────

	async function saveClass() {
		if (!classForm.name.trim()) return toast.error('Class name is required');
		if (editingClass) {
			const { error } = await supabase.from('classes').update({ name: classForm.name, description: classForm.description }).eq('id', editingClass.id);
			if (error) return toast.error('Failed to update class');
			toast.success('Class updated');
		} else {
			const { data, error } = await supabase.from('classes').insert({ name: classForm.name, description: classForm.description, created_by: user!.id }).select().single();
			if (error) return toast.error('Failed to create class');
			await supabase.from('class_members').insert({ class_id: data.id, user_id: user!.id, role: 'owner' });
			toast.success('Class created!');
		}
		closeClassModal();
		loadClasses();
	}

	async function deleteClass(c: ClassItem) {
		if (!confirm(`Delete "${c.name}"? This cannot be undone.`)) return;
		const { error } = await supabase.from('classes').delete().eq('id', c.id);
		if (error) return toast.error('Failed to delete class');
		toast.success('Class deleted');
		if (selectedClass?.id === c.id) setSelectedClass(null);
		loadClasses();
	}

	// ── Subject modal helpers ──────────────────────────────────────────────────

	function openCreateSubject() {
		setEditingSubject(null);
		setSubjectForm({ name: '', description: '' });
		setShowSubjectModal(true);
	}

	function openEditSubject(s: Subject) {
		setEditingSubject(s);
		setSubjectForm({ name: s.name, description: s.description ?? '' });
		setShowSubjectModal(true);
	}

	function closeSubjectModal() {
		setShowSubjectModal(false);
		setEditingSubject(null);
		setSubjectForm({ name: '', description: '' });
	}

	// ── Subject CRUD ───────────────────────────────────────────────────────────

	async function saveSubject() {
		if (!subjectForm.name.trim()) return toast.error('Subject name is required');
		if (editingSubject) {
			const { error } = await supabase.from('class_subjects').update({ name: subjectForm.name, description: subjectForm.description }).eq('id', editingSubject.id);
			if (error) return toast.error('Failed to update subject');
			toast.success('Subject updated');
		} else {
			const { error } = await supabase.from('class_subjects').insert({ name: subjectForm.name, description: subjectForm.description, class_id: selectedClass!.id });
			if (error) return toast.error('Failed to create subject');
			toast.success('Subject created!');
		}
		closeSubjectModal();
		loadClassData(selectedClass!.id);
	}

	async function deleteSubject(s: Subject) {
		if (!confirm(`Delete subject "${s.name}"?`)) return;
		const { error } = await supabase.from('class_subjects').delete().eq('id', s.id);
		if (error) return toast.error('Failed to delete subject');
		toast.success('Subject deleted');
		loadClassData(selectedClass!.id);
	}

	// ── Task modal helpers ─────────────────────────────────────────────────────

	function openCreateTask() {
		setEditingTask(null);
		setTaskForm({ name: '', description: '', deadline: '', subject_id: '' });
		setShowTaskModal(true);
	}

	function openEditTask(t: Task) {
		setEditingTask(t);
		setTaskForm({
			name: t.name,
			description: t.description ?? '',
			deadline: t.deadline ? t.deadline.slice(0, 16) : '',
			subject_id: t.subjectId ?? '',
		});
		setShowTaskModal(true);
	}

	function closeTaskModal() {
		setShowTaskModal(false);
		setEditingTask(null);
		setTaskForm({ name: '', description: '', deadline: '', subject_id: '' });
	}

	// ── Task CRUD ──────────────────────────────────────────────────────────────

	async function saveTask() {
		if (!taskForm.name.trim()) return toast.error('Task name is required');

		// Convert local datetime to ISO string with timezone offset
		const deadline = taskForm.deadline
			? new Date(taskForm.deadline).toISOString()
			: null;

		const payload = {
			name: taskForm.name,
			description: taskForm.description || null,
			deadline,  // ← use the converted value
			subject_id: taskForm.subject_id || null,
			class_id: selectedClass!.id,
			created_by: user!.id,
		};

		if (editingTask) {
			const { error } = await supabase.from('tasks').update(payload).eq('id', editingTask.id);
			if (error) return toast.error('Failed to update task');
			toast.success('Task updated');
		} else {
			const { error } = await supabase.from('tasks').insert(payload);
			if (error) return toast.error('Failed to create task');
			toast.success('Task created!');
		}
		closeTaskModal();
		loadClassData(selectedClass!.id);
	}

	async function deleteTask(t: Task) {
		if (!confirm(`Delete task "${t.name}"?`)) return;
		const { error } = await supabase.from('tasks').delete().eq('id', t.id);
		if (error) return toast.error('Failed to delete task');
		toast.success('Task deleted');
		loadClassData(selectedClass!.id);
	}

	// ── Task completion ────────────────────────────────────────────────────────

	async function toggleCompletion(task: Task, isPublic = true) {
		const isDone = completions.some(c => c.taskId === task.id && c.userId === user!.id);
		if (isDone) {
			await supabase.from('task_completions').delete().eq('task_id', task.id).eq('user_id', user!.id);
		} else {
			await supabase.from('task_completions').insert({ task_id: task.id, user_id: user!.id, is_public: isPublic });
		}
		loadClassData(selectedClass!.id);
	}

	async function updateCompletionVisibility(taskId: string, isPublic: boolean) {
		await supabase
			.from('task_completions')
			.update({ is_public: isPublic })
			.eq('task_id', taskId)
			.eq('user_id', user!.id);
		loadClassData(selectedClass!.id);
	}

	// ── Member management ──────────────────────────────────────────────────────

	async function updateMemberRole(userId: string, role: Role) {
		const { error } = await supabase.from('class_members').update({ role }).eq('class_id', selectedClass!.id).eq('user_id', userId);
		if (error) return toast.error('Failed to update role');
		toast.success('Role updated');
		loadClassData(selectedClass!.id);
	}

	async function removeMember(userId: string) {
		if (!confirm('Remove this member from the class?')) return;
		const { error } = await supabase.from('class_members').delete().eq('class_id', selectedClass!.id).eq('user_id', userId);
		if (error) return toast.error('Failed to remove member');
		toast.success('Member removed');
		loadClassData(selectedClass!.id);
		loadClasses();
	}

	// ── Invite modal helpers ───────────────────────────────────────────────────

	function openInviteModal() {
		setCreatedInvite(null);
		setInviteForm({ password: '', useGenerated: true });
		setShowInviteModal(true);
	}

	function closeInviteModal() {
		setShowInviteModal(false);
		setCreatedInvite(null);
	}

	// ── Invite management ──────────────────────────────────────────────────────

	async function createInvite() {
		const password = inviteForm.useGenerated ? generatePassword() : inviteForm.password.trim();
		if (!password) return toast.error('Password is required');
		const code = generateCode();
		const { data, error } = await supabase
			.from('class_invites')
			.insert({ class_id: selectedClass!.id, code, password, created_by: user!.id })
			.select()
			.single();
		if (error) return toast.error('Failed to create invite');
		setCreatedInvite(mapClassInvite(data));
		loadClassData(selectedClass!.id);
	}

	async function deleteInvite(inviteId: string) {
		const { error } = await supabase.from('class_invites').delete().eq('id', inviteId);
		if (error) return toast.error('Failed to delete invite');
		toast.success('Invite deleted');
		loadClassData(selectedClass!.id);
	}

	function copyInviteLink(invite: ClassInvite) {
		const url = `${window.location.origin}/join?code=${invite.code}`;
		navigator.clipboard.writeText(url);
		toast.success('Link copied!');
	}

	function copyCode(code: string) {
		navigator.clipboard.writeText(code);
		toast.success('Code copied!');
	}

	// ── Join modal helpers ─────────────────────────────────────────────────────

	function openJoinModal() {
		setJoinStep('code');
		setJoinForm({ code: '', password: '' });
		setJoinClassPreview(null);
		setShowJoinModal(true);
	}

	function closeJoinModal() {
		setShowJoinModal(false);
		setJoinStep('code');
		setJoinForm({ code: '', password: '' });
		setJoinClassPreview(null);
	}

	// ── Join class ─────────────────────────────────────────────────────────────

	async function lookupCode() {
		if (!joinForm.code.trim()) return toast.error('Enter a class code');
		setJoinLoading(true);
		const { data, error } = await supabase
			.from('class_invites')
			.select('id, class_id, classes(name)')
			.eq('code', joinForm.code.trim().toUpperCase())
			.single();
		setJoinLoading(false);
		if (error || !data) return toast.error('Invalid code — double check and try again');

		const { data: existing } = await supabase
			.from('class_members')
			.select('user_id')
			.eq('class_id', data.class_id)
			.eq('user_id', user!.id)
			.single();
		if (existing) return toast.error("You're already a member of this class");

		setJoinClassPreview({ name: (data as any).classes.name, id: data.class_id, inviteId: data.id });
		setJoinStep('password');
	}

	async function joinClass() {
		if (!joinForm.password.trim()) return toast.error('Enter the class password');
		if (!joinClassPreview) return;
		setJoinLoading(true);
		const { data: invite, error } = await supabase.from('class_invites').select('password').eq('id', joinClassPreview.inviteId).single();
		if (error || !invite) { setJoinLoading(false); return toast.error('Something went wrong'); }
		if (invite.password !== joinForm.password.trim()) { setJoinLoading(false); return toast.error('Wrong password'); }
		const { error: joinError } = await supabase.from('class_members').insert({ class_id: joinClassPreview.id, user_id: user!.id, role: 'member' });
		setJoinLoading(false);
		if (joinError) return toast.error('Failed to join class');
		toast.success(`Joined ${joinClassPreview.name}!`);
		closeJoinModal();
		loadClasses();
	}

	// ── Return ─────────────────────────────────────────────────────────────────

	return {
		// auth
		user,

		// data
		classes, selectedClass,
		subjects, tasks,
		members, memberProfiles,
		completions, invites,
		loading, activeTab, setActiveTab,

		// class
		showClassModal, editingClass, classForm, setClassForm,
		openCreateClass, openEditClass, closeClassModal,
		saveClass, deleteClass, selectClass, loadClasses,

		// subject
		showSubjectModal, editingSubject, subjectForm, setSubjectForm,
		openCreateSubject, openEditSubject, closeSubjectModal,
		saveSubject, deleteSubject,

		// task
		showTaskModal, editingTask, taskForm, setTaskForm,
		openCreateTask, openEditTask, closeTaskModal,
		saveTask, deleteTask,
		toggleCompletion, updateCompletionVisibility,

		// members
		updateMemberRole, removeMember,

		// invite
		showInviteModal, inviteForm, setInviteForm, createdInvite,
		openInviteModal, closeInviteModal,
		createInvite, deleteInvite,
		copyInviteLink, copyCode,

		// join
		showJoinModal, joinForm, setJoinForm,
		joinStep, setJoinStep,
		joinClassPreview, joinLoading,
		openJoinModal, closeJoinModal,
		lookupCode, joinClass,
	};
}