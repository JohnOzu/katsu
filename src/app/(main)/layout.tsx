'use client'

import MainFooter from "@/src/components/ui/MainFooter";
import MainHeader from "@/src/components/ui/MainHeader";
import { useUserStore } from "@/src/lib/stores/user-store";

export default function Layout({ 
    children 
}: { children: React.ReactNode }) {

    const hydrated = useUserStore((state) => state.hydrated);

	if (!hydrated) {
		return (
			<div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 flex items-center justify-center">
				<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

    return(
        <>
            <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
                <MainHeader />
                <main>
                    {children}
                </main>
                <MainFooter />
            </div>
        </>
    )
}