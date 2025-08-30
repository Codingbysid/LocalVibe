import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

// Trail persistence functions
export const saveTrail = async (userId: string, trail: any) => {
  const { data, error } = await supabase
    .from('saved_trails')
    .insert({
      user_id: userId,
      title: trail.narrative.title,
      description: trail.narrative.description,
      stops: trail.stops,
      vibes: trail.vibes || [],
      created_at: new Date().toISOString()
    })
  return { data, error }
}

export const getUserTrails = async (userId: string) => {
  const { data, error } = await supabase
    .from('saved_trails')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export const deleteTrail = async (trailId: string) => {
  const { error } = await supabase
    .from('saved_trails')
    .delete()
    .eq('id', trailId)
  return { error }
}
