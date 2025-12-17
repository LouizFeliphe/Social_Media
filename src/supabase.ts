import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASEURL as string
const supabaseKey = import.meta.env.VITE_SUPABASEKEY as string

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase env vars não configuradas")
}

export const supabase = createClient(supabaseUrl,supabaseKey)