'use client'

import { useEffect } from 'react'
import { createClient } from '@lib/supabase'
import { useUserStore } from '@lib/stores/user-store'

export default function UserProvider({ children }: { children: React.ReactNode }) {
	const setUser = useUserStore((state) => state.setUser)
	const setHydrated = useUserStore(state => state.setHydrated)

	useEffect(() => {
		const supabase = createClient()

		// Get initial user
		supabase.auth.getUser().then(({ data }) => {
			setUser(data.user);
			setHydrated(true);
			console.log(data.user);
		})

		// Listen for auth changes (login, logout, token refresh)
		const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null)
		})

		return () => subscription.unsubscribe()
	}, [setUser, setHydrated])

	return <>{children}</>
}