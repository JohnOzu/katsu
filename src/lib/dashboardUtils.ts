// ─── Random code generator ────────────────────────────────────────────────────

export function generateCode() {
	return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function generatePassword() {
	const words = ['Maple', 'Storm', 'Comet', 'Blaze', 'Ridge', 'Frost', 'Ember', 'Creek'];
	const nums = Math.floor(100 + Math.random() * 900);
	return words[Math.floor(Math.random() * words.length)] + nums;
}

// ─── Deadline helpers ─────────────────────────────────────────────────────────

export function deadlineLabel(deadline: string | null) {
	if (!deadline) return null;
	const d = new Date(deadline);
	const diff = d.getTime() - new Date().getTime();
	const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
	if (days < 0)   return { label: 'Overdue',       color: 'text-red-500 bg-red-50 border border-red-100' };
	if (days === 0) return { label: 'Due today',      color: 'text-orange-500 bg-orange-50 border border-orange-100' };
	if (days === 1) return { label: 'Due tomorrow',   color: 'text-yellow-600 bg-yellow-50 border border-yellow-100' };
	if (days <= 7)  return { label: `${days}d left`,  color: 'text-blue-600 bg-blue-50 border border-blue-100' };
	return { label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), color: 'text-slate-500 bg-slate-100 border border-slate-200' };
}