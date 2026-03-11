export default function Modal({ 
	title, 
	onClose, 
	children, 
	wide 
}: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
			<div className={`w-full ${wide ? 'max-w-lg' : 'max-w-md'} bg-white rounded-3xl shadow-2xl shadow-slate-900/20 border border-slate-100 overflow-hidden animate-fadeInUp`}>
				<div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
					<h2 className="text-lg font-bold text-slate-900">{title}</h2>
					<button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-slate-400 hover:text-slate-600">
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
				<div className="p-6">{children}</div>
			</div>
		</div>
	);
}