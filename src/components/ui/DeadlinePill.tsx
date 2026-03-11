import { deadlineLabel } from '@lib/dashboardUtils';

export default function DeadlinePill({ deadline }: { deadline: string | null }) {
    if (!deadline) return null;
    const d = new Date(deadline);
    const dl = deadlineLabel(deadline);
    const formatted = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    return (
        <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border w-fit ${dl?.color ?? 'text-slate-500 bg-slate-50 border-slate-200'}`}>
            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatted} · {time}</span>
            {dl && <span className="opacity-60">({dl.label})</span>}
        </div>
    );
}