export default function Textarea({ 
    label, 
    ...props 
}: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">{label}</label>
            <textarea
                {...props}
                rows={3}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all resize-none"
            />
        </div>
    );
}