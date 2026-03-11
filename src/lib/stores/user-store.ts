import { create } from 'zustand'
import { User } from '@supabase/supabase-js'

type UserStore = {
	user: User | null
	hydrated: boolean
	setUser: (user: User | null) => void
	setHydrated: (hydrated: boolean) => void
}

export const useUserStore = create<UserStore>((set) => ({
	user: null,
	hydrated: false,
	setUser: (user) => set({ user }),
	setHydrated: (hydrated) => set({ hydrated }),
}))