'use server'

import { createServerSupabaseClient } from '@lib/supabase-server'
import { redirect } from 'next/navigation'

export async function signInWithGoogle() {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
    })

    if (error) throw error
    if (data.url) redirect(data.url)
}

export async function signOut() {
    const supabase = await createServerSupabaseClient()
    await supabase.auth.signOut()
    redirect('/login')
}

export async function getUser() {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
}