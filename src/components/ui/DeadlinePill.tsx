'use client';

import { useState, useEffect } from 'react';
import { deadlineLabel } from '@lib/dashboardUtils';

function getCountdown(deadline: Date, isComplete: boolean): string {
    if (isComplete) return 'completed';
    const diff = deadline.getTime() - Date.now();
    if (diff <= 0) return 'overdue';

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (days >= 1)    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    if (hours >= 1)   return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes >= 1) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
}

export default function DeadlinePill({ 
    deadline,
    isComplete = false
}: { 
    deadline: string | null
    isComplete: boolean
}) {
    const [countdown, setCountdown] = useState(() =>
        deadline ? getCountdown(new Date(deadline), isComplete) : ''
    );

    useEffect(() => {
        if (!deadline) return;
        const d = new Date(deadline);
        const id = setInterval(() => setCountdown(getCountdown(d, isComplete)), 1000);
        return () => clearInterval(id);
    }, [deadline, isComplete]);

    if (!deadline) return null;

    const d = new Date(deadline);
    const dl = deadlineLabel(deadline, isComplete);
    const formatted = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    return (
        <div 
            className={`
                inline-flex flex-wrap items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border w-fit 
                ${dl?.color ?? 'text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'} 
                ${isComplete ? 'line-through opacity-80' : ''}
            `}
        >
            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatted} · {time}</span>
            <span className="opacity-60">({countdown})</span>
        </div>
    );
}