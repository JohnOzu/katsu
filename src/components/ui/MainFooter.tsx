import Link from "next/link";

export default function MainFooter() {
    return(
        <>
            <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <Link className="flex items-center space-x-3 mb-4" href="/">
                                <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v18M5 4c3-2 6 2 9 0s6 2 6 2v9s-3-2-6 0-6-2-9 0" />
                                    </svg>
                                </div>
                                <span className="text-xl font-bold text-slate-900 dark:text-white">Katsu</span>
                            </Link>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">Empowering students to stay organized and succeed together.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-3">Product</h4>
                            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                <li><Link href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</Link></li>
                                <li><Link href="/FAQ" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">FAQ</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-3">Company</h4>
                            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                <li><Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</Link></li>
                                <li><Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-3">Legal</h4>
                            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                <li><Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy</Link></li>
                                <li><Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms</Link></li>
                                <li><Link href="/security" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Security</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-800 mt-8 pt-8 text-center text-sm text-slate-600 dark:text-slate-400">
                        © 2026 Katsu. All rights reserved.
                    </div>
                </div>
            </footer>
        </>
    )
}