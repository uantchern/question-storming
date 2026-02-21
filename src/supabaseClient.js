import { createClient } from '@supabase/supabase-js'

// IMPORTANT: Replace these with your actual Supabase project credentials
// found in Project Settings > API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = (supabaseUrl.includes('placeholder'))
    ? { from: () => ({ insert: () => Promise.resolve({ error: null }), select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }) }) }
    : createClient(supabaseUrl, supabaseAnonKey)
